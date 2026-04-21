import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routers.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { deviceInfo } from "./middleware/deviceInfo.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(deviceInfo);

app.use("/api/auth", authRouter);

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from server" });
});

connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
}

export default app;
