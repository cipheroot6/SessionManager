import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routers.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import newDevice from "./middleware/deviceInfo.js";
import { deviceInfo } from "./middleware/deviceInfo.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(deviceInfo);

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from server" });
});
connectDB();

console.log(newDevice);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

export default app;
