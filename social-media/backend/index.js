import express from "express";
import dotenv from "dotenv";
import authUser from "./routes/auth.route.js";
import connectDB from "./lib/db.js";
import userRoute from "./routes/auth.user.js";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import notificationsRoute from "./routes/notification.route.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

/* ================= CLOUDINARY ================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ================= MIDDLEWARE ================= */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

/* ================= CORS ================= */
const allowedOrigins = [
  process.env.CLIENT_API_KEY,
  process.env.CLIENT_API_KEY2,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ================= STATIC AVATAR FIX ================= */
app.use("/avatar", express.static("../frontend/public/avatar"));

/* ================= ROUTES ================= */
app.use("/api/auth", authUser);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationsRoute);

/* ================= FRONTEND SERVE ================= */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

/* ================= SERVER ================= */
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
