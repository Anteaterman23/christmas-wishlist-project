import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  wishlist: [{ type: String }] // Array of wishlist item IDs
});

// Wishlist Item Schema
const wishlistItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true, default: uuidv4 },
  itemName: { type: String, required: true },
  hyperlink: { type: String, default: '' },
  comments: { type: String, default: '' },
  purchased: { type: Boolean, default: false },
  purchasedBy: { type: String, default: null },
  ownerId: { type: String, required: true } // Reference to user ID
});

// Password Schema (stores hashed passwords)
const passwordSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true }, // 'user' or 'admin'
  passwordHash: { type: String, required: true }
});

// Mongoose models
export const User = mongoose.model('User', userSchema);
export const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);
export const Password = mongoose.model('Password', passwordSchema);