import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import {db} from "./db/db.js";

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

wss.on("connection", (ws, req) => {
  // Extract token from query parameters
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get(
    "token"
  );

  if (!token) {
    ws.close(1008, "Unauthorized");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Store the connection with user ID
    clients.set(userId, ws);

    ws.on("message", async (message) => {
      try {
        const parsed = JSON.parse(message);
        await handleMessage(
          userId,
          parsed.receiverId,
          parsed.message,
          parsed.packageId
        );
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    ws.on("close", () => {
      clients.delete(userId);
    });
  } catch (error) {
    ws.close(1008, "Unauthorized");
  }
});

async function handleMessage(senderId, receiverId, message, packageId) {
  try {
    // Save to database
    const [result] = await db.query(
      "INSERT INTO chats (package_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)",
      [packageId, senderId, receiverId, message]
    );

    // Get the full message details
    const [messageRows] = await db.query(
      `SELECT c.*, u.username AS sender_name 
       FROM chats c
       JOIN users u ON c.sender_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    const newMessage = messageRows[0];

    // Notify receiver if online
    const receiverWs = clients.get(receiverId);
    if (receiverWs) {
      receiverWs.send(
        JSON.stringify({
          type: "new_message",
          message: newMessage,
        })
      );
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
}

export default wss;
