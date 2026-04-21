import mongoose from "mongoose";

export const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  userAgent: String,
  ip: String,
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;