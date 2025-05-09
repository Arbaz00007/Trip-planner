import express from "express";
import { createServer } from "http"; // Add this
import { Server } from "socket.io"; // Add this
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv(); // Load environment variables from .env file
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import esewaRoute from "./routes/esewaRoute.js";
import userRoute from "./routes/userRoute.js";
import guiderRoute from "./routes/guiderRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import chatRoute from "./routes/chatRoute.js"; // Add this
import reviewRoute from "./routes/reviewRoute.js"; // Add this
import transactionRoute from "./routes/transactionRoute.js"; // Add this
import {
  getAllNotifications,
  sendNotification,
} from "./controller/notification.js";

const app = express();
const server = createServer(app); // Replace app.listen with this

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// Attach io to app for use in controllers
app.set("io", io);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send previous notifications when a user connects
  db.query(
    "SELECT * FROM notification ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        return console.log(err);
      }

      socket.emit("previous-notifications", rows);
      // console.log(rows, ":Main file log");
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/notifications", getAllNotifications);
app.post("/send-notification", (req, res) => sendNotification(req, res, io));

// Routes
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", esewaRoute);
app.use("/api", userRoute);
app.use("/api", reviewRoute);
app.use("/api", guiderRoute);
app.use("/api", bookingRoute);
app.use("/api", transactionRoute);
app.use("/api/chat", chatRoute); // Add this line
app.use(express.static("public"));

// Start server (use server.listen instead of app.listen)
const port = 5050;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
