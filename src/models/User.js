import mongoose from 'mongoose'

/**
 * defines the schema for a user, including fields for username and password hash
 */
const userSchema = new mongoose.Schema({
  // unique username for the user, which is required
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // the hashed password for the user, which is required
  passwordHash: { type: String, required: true }
}, { timestamps: true })

// compile the schema into a model and export it for use in other parts of the application
export const User = mongoose.model('User', userSchema)
