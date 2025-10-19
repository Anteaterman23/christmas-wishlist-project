import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Password } from "./schemas.js";

dotenv.config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function initializePasswords() {
  try {
    const userExists = await Password.findOne({ role: "user" });
    const adminExists = await Password.findOne({ role: "admin" });

    if (!userExists) {
      const userHash = await bcrypt.hash(process.env.USER_PASSWORD, 10);
      await Password.create({ role: "user", passwordHash: userHash });
      console.log("User password initialized");
    }

    if (!adminExists) {
      const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Password.create({ role: "admin", passwordHash: adminHash });
      console.log("Admin password initialized");
    }
  } catch (error) {
    console.error("Error initializing passwords:", error);
  } finally {
    mongoose.connection.close();
  }
}

initializePasswords();
