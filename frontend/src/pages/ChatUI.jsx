import React, { useState, useEffect, useContext } from "react";
import { FaUser, FaPaperPlane, FaEllipsisV, FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { get, post } from "../utils/api";
import Cookies from "js-cookie";

const ChatUI = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [ws, setWs] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = Cookies.get("accessToken");
    const websocket = new WebSocket(`ws://localhost:8080?token=${token}`);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        if (data.message.package_id === selectedPackage) {
          setMessages((prev) => [...prev, data.message]);
        }
        setConversations((prev) =>
          prev.map((conv) =>
            conv.package_id === data.message.package_id
              ? {
                  ...conv,
                  last_message: data.message.message,
                  last_message_time: data.message.timestamp,
                  unread_count:
                    data.message.receiver_id === currentUser?.id
                      ? conv.unread_count + 1
                      : conv.unread_count,
                }
              : conv
          )
        );
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [selectedPackage, currentUser?.id]);

  // Handle initial conversation from package page
  useEffect(() => {
    if (location.state?.packageId && location.state?.creatorId) {
      setSelectedPackage(location.state.packageId);
      setSelectedUser(location.state.creatorId);
      fetchMessages(location.state.packageId);

      // Clear location state to prevent re-triggering
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await get("/api/chat/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (packageId) => {
    try {
      const response = await get(`/api/chat/package/${packageId}`);
      if (response.data.length === 0 && location.state?.creatorId) {
        // No messages found, but we have a creator ID - show empty state with prompt
        setMessages([
          {
            id: "placeholder",
            message: `Start a conversation about ${location.state.packageName}`,
            isPlaceholder: true,
          },
        ]);
      } else {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedPackage && selectedUser) {
      try {
        // Send via WebSocket for real-time
        if (ws) {
          ws.send(
            JSON.stringify({
              receiverId: selectedUser,
              message: message,
              packageId: selectedPackage,
            })
          );
        }

        // Also send via HTTP to ensure persistence
        const response = await post("/api/chat/send", {
          package_id: selectedPackage,
          message: message,
        });

        setMessages((prev) => [...prev, response.data]);
        setMessage("");

        // Update conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.package_id === selectedPackage
              ? {
                  ...conv,
                  last_message: message,
                  last_message_time: new Date().toISOString(),
                  unread_count: 0,
                }
              : conv
          )
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const selectConversation = (packageId, otherUserId) => {
    setSelectedPackage(packageId);
    setSelectedUser(otherUserId);
    fetchMessages(packageId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    } else if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } else {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getRoleBadge = (roleId) => {
    switch (roleId) {
      case 1:
        return { text: "Admin", class: "bg-purple-100 text-purple-800" };
      case 2:
        return { text: "Guider", class: "bg-blue-100 text-blue-800" };
      default:
        return { text: "User", class: "bg-gray-100 text-gray-800" };
    }
  };
  useEffect(() => {
    const initializeNewConversation = async () => {
      if (location.state?.packageId && location.state?.creatorId) {
        const { packageId, creatorId, packageName } = location.state;

        // Check if conversation already exists
        const existingConv = conversations.find(
          (c) => c.package_id == packageId
        );

        if (!existingConv) {
          try {
            // Create a new conversation by sending a welcome message
            await post("/api/chat/send", {
              package_id: packageId,
              message: `Hi! I'm interested in your package "${packageName}"`,
            });

            // Refresh conversations
            await fetchConversations();
          } catch (error) {
            console.error("Error initializing conversation:", error);
          }
        }

        // Set the selected conversation
        setSelectedPackage(packageId);
        setSelectedUser(creatorId);
        fetchMessages(packageId);

        // Clear location state
        navigate(location.pathname, { replace: true });
      }
    };

    initializeNewConversation();
  }, [location.state, conversations]);

  return (
    <div className="flex h-[calc(100vh-4.4rem)] bg-gray-100 overflow-hidden">
      {/* Left sidebar - Conversation list */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <div className="flex space-x-2">
              <IoMdNotifications className="text-gray-600 text-xl cursor-pointer" />
              <FaEllipsisV className="text-gray-600 cursor-pointer" />
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2 pl-8 rounded-lg bg-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations
            ?.filter(
              (conv) =>
                conv.package_name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                conv.other_user_name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((conv) => {
              const badge = getRoleBadge(conv.other_user_role);
              return (
                <div
                  key={conv.package_id}
                  onClick={() =>
                    selectConversation(conv.package_id, conv.other_user_id)
                  }
                  className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedPackage === conv.package_id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUser className="text-gray-600" />
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <h2 className="font-semibold">
                          {conv.other_user_name}
                        </h2>
                        <span
                          className={`text-xs px-1 rounded ml-1 ${badge.class}`}
                        >
                          {badge.text}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(conv.last_message_time)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.package_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.last_message}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Right side - Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedPackage ? (
          <>
            {/* Chat header */}
            <div className="p-3 border-b bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <div className="ml-3">
                {conversations.find(
                  (c) => c.package_id === selectedPackage
                ) && (
                  <>
                    <div className="flex items-center">
                      <h2 className="font-semibold">
                        {
                          conversations.find(
                            (c) => c.package_id === selectedPackage
                          )?.other_user_name
                        }
                      </h2>
                      <span
                        className={`text-xs px-1 rounded ml-1 ${
                          getRoleBadge(
                            conversations.find(
                              (c) => c.package_id === selectedPackage
                            )?.other_user_role
                          ).class
                        }`}
                      >
                        {
                          getRoleBadge(
                            conversations.find(
                              (c) => c.package_id === selectedPackage
                            )?.other_user_role
                          ).text
                        }
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {
                        conversations.find(
                          (c) => c.package_id === selectedPackage
                        )?.package_name
                      }
                    </p>
                  </>
                )}
              </div>
              <div className="ml-auto">
                <FaEllipsisV className="text-gray-600 cursor-pointer" />
              </div>
            </div>

            {/* Chat messages */}
           {/* Chat messages */}
           <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                messages.map((msg) =>
                  msg.isPlaceholder ? (
                    <div key="placeholder" className="mb-4 max-w-xs mx-auto text-center">
                      <div className="p-3 rounded-lg bg-gray-200">
                        {msg.message}
                      </div>
                      <div className="text-xs mt-2 text-gray-500">
                        Type a message below to begin chatting
                      </div>
                    </div>
                  ) : (
                    <div
                      key={msg.id}
                      className={`mb-4 max-w-xs ${
                        msg.sender_id === currentUser?.id ? "ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          msg.sender_id === currentUser?.id
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender_id === currentUser?.id ? "text-right" : ""
                        } text-gray-500`}
                      >
                        {formatTime(msg.timestamp)}
                        {msg.sender_id !== currentUser?.id &&
                          ` • ${msg.sender_name}`}
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* Message input */}
            <div className="p-3 border-t bg-white">
              <div className="flex">
                <input
                  type="text"
                  placeholder={
                    messages[0]?.isPlaceholder 
                      ? "Type your first message..." 
                      : "Type a message..."
                  }
                  className="flex-1 p-2 rounded-l-lg border border-r-0"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  className={`p-2 rounded-r-lg ${
                    loading || !message.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                >
                  {loading ? "Sending..." : <FaPaperPlane />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;