import { User, WishlistItem, Password } from "./schemas.js"
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  // process.env.LOCALHOST_URL,
];

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigins.includes(origin)) {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// ==================== AUTH ROUTES ====================

// Login / Password verification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Check admin password first
    const adminPassword = await Password.findOne({ role: 'admin' });
    const isAdmin = await bcrypt.compare(password, adminPassword.passwordHash);
    
    if (isAdmin) {
      return res.json({ success: true, isAdmin: true });
    }
    
    // Check user password
    const userPassword = await Password.findOne({ role: 'user' });
    const isUser = await bcrypt.compare(password, userPassword.passwordHash);
    
    if (isUser) {
      return res.json({ success: true, isAdmin: false });
    }
    
    return res.status(401).json({ success: false, message: 'Invalid password' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update passwords (admin only - you'd call this manually to change passwords)
app.post('/api/auth/update-password', async (req, res) => {
  try {
    const { role, oldPassword, newPassword } = req.body;
    
    if (!role || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Role, old password, and new password are required' });
    }
    
    // Verify old password
    const passwordRecord = await Password.findOne({ role });
    if (!passwordRecord) {
      return res.status(404).json({ error: 'Password not found for this role' });
    }
    
    const isValidOldPassword = await bcrypt.compare(oldPassword, passwordRecord.passwordHash);
    if (!isValidOldPassword) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }
    
    // Hash and update new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await Password.findOneAndUpdate(
      { role },
      { passwordHash: newPasswordHash }
    );
    
    res.json({ success: true, message: `${role} password updated successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    
    // Get wishlist counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const wishlistCount = user.wishlist.length;
        return {
          id: user._id,
          name: user.name,
          wishlistCount
        };
      })
    );
    
    res.json(usersWithCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user by name
app.get('/api/users/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const newUser = await User.create({
      name,
      wishlist: []
    });
    
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      wishlistCount: 0
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete all wishlist items for this user
    await WishlistItem.deleteMany({ itemId: { $in: user.wishlist } });
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'User and wishlist deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WISHLIST ROUTES ====================

// Get wishlist for a specific user
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const wishlistItems = await WishlistItem.find({
      itemId: { $in: user.wishlist }
    });
    
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to user's wishlist
app.post('/api/wishlist/:userId', async (req, res) => {
  try {
    const { itemName, hyperlink, comments } = req.body;
    const userId = req.params.userId;
    
    if (!itemName) {
      return res.status(400).json({ error: 'Item name is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create the wishlist item
    const itemId = uuidv4();
    const newItem = await WishlistItem.create({
      itemId,
      itemName,
      hyperlink: hyperlink || '',
      comments: comments || '',
      purchased: false,
      purchasedBy: null,
      ownerId: userId
    });
    
    // Add item ID to user's wishlist array
    user.wishlist.push(itemId);
    await user.save();
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete wishlist item
app.delete('/api/wishlist/:itemId', async (req, res) => {
  try {
    const item = await WishlistItem.findOne({ itemId: req.params.itemId });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Remove from user's wishlist array
    await User.updateOne(
      { _id: item.ownerId },
      { $pull: { wishlist: req.params.itemId } }
    );
    
    // Delete the item
    await WishlistItem.deleteOne({ itemId: req.params.itemId });
    
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update wishlist item
app.put('/api/wishlist/:itemId', async (req, res) => {
  try {
    const { itemName, hyperlink, comments } = req.body;
    const item = await WishlistItem.findOne({ itemId: req.params.itemId });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Update the item fields
    if (itemName !== undefined) item.itemName = itemName;
    if (hyperlink !== undefined) item.hyperlink = hyperlink;
    if (comments !== undefined) item.comments = comments;
    
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle purchase status
app.patch('/api/wishlist/:itemId/purchase', async (req, res) => {
  try {
    const { purchasedBy } = req.body;
    const item = await WishlistItem.findOne({ itemId: req.params.itemId });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Toggle purchase status
    if (item.purchased && item.purchasedBy === purchasedBy) {
      // Unpurchase (cancel purchase)
      item.purchased = false;
      item.purchasedBy = null;
    } else if (!item.purchased) {
      // Mark as purchased
      item.purchased = true;
      item.purchasedBy = purchasedBy;
    }
    
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});