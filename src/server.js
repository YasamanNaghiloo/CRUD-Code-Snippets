import 'dotenv/config'
import { createApp } from './app.js'
import { connectDB } from './config/mongoose.js'

// ensure that the required environment variables are set
const mongoUri = process.env.MONGODB_URI
const sessionSecret = process.env.SESSION_SECRET
if (!mongoUri || !sessionSecret) {
  console.error(' Missing required environment variables. Ensure MONGODB_URI and SESSION_SECRET are set in .env')
  process.exit(1)
}
// connect to MongoDB using the provided URI
await connectDB(mongoUri)
console.log(' Connected to MongoDB')
// create and configure the Express application
const app = createApp()
const port = process.env.PORT || 3000
// start the server and listen on the specified port
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`)
})
