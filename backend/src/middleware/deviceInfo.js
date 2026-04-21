import Device from "../models/session.models.js";

let newDevice = "null";
export const deviceInfo = async (req, res, next) => {
  try {
    req.deviceInfo = {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };
    newDevice = new Device(req.deviceInfo);
    await newDevice.save();
    next();
  } catch (error) {
    console.error("Error saving device info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default newDevice;
