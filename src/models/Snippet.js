import mongoose from 'mongoose'

/**
 * defines the schema for a code snippet, including fields for title, code, language, tags, and owner
 */
const snippetSchema = new mongoose.Schema({
  // the title of the snippet, which is required and trimmed of whitespace
  title: { type: String, required: true, trim: true },
  // the code content of the snippet, which is required
  code: { type: String, required: true },
  // the programming language of the snippet, which is optional and trimmed of whitespace
  language: { type: String, trim: true },
  // an array of tags associated with the snippet, which are optional, trimmed of whitespace, and converted to lowercase
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  // the owner of the snippet, which is required and references the User model
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })
// compile the schema into a model and export it for use in other parts of the application
export const Snippet = mongoose.model('Snippet', snippetSchema)
