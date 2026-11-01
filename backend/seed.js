import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

const DEMO_ADMIN = {
  name: "Demo Admin",
  email: "admin@mkconstruction.com",
  password: "Admin@123",
};

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to DB:", mongoose.connection.name);

// Hash here so the password is stored correctly
// whether or not the User model hashes in a pre-save hook
const hash = await bcrypt.hash(DEMO_ADMIN.password, 10);

await User.updateOne(
  { email: DEMO_ADMIN.email },
  {
    $set: {
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      password: hash,
      role: "admin",
      isActive: true,
    },
  },
  { upsert: true }
);

console.log("Demo admin ready:", DEMO_ADMIN.email);
process.exit();