import mongoose from 'mongoose'

/**
 * connects to the MongoDB database
 * @param {string} mongoUri - the connection URI for the MongoDB
 * @returns {Promise<void>} resolves when the connection is successful
 */
export async function connectDB (mongoUri) {
  // set strictQuery to true to avoid deprecation warning
  mongoose.set('strictQuery', true)
  // connect to the database using the provided URI
  await mongoose.connect(mongoUri)
}
