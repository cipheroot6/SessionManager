import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/session.models.js";

export const generateToken = async (savedUser, req, res) => {
  const { JWT_SECRET } = process.env;
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const sessionId = crypto.randomUUID();
    const deviceId = req.get("x-device-id") || crypto.randomUUID();
    const userId = savedUser._id;

    await Session.create({
      sessionId,
      userId,
      deviceId,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    const token = await jsonwebtoken.sign(
      { userId, sessionId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      },
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
