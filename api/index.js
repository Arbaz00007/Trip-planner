import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import esewaRoute from "./routes/esewaRoute.js";
import userRoute from "./routes/userRoute.js";
import guiderRoute from "./routes/guiderRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const port = 5050;

app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", esewaRoute);
app.use("/api", userRoute);
app.use("/api", guiderRoute);
app.use("/api", bookingRoute);
// Serve static files from the "public" directory
app.use(express.static("public"));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
