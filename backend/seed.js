import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@mkconstruction.com" });

  if (existing) {
    console.log("Admin already exists");
  } else {
    await User.create({
      name: "MK Admin",
      email: "admin@mkconstruction.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin created: admin@mkconstruction.com / admin123");
  }

  await mongoose.disconnect();
};

run();