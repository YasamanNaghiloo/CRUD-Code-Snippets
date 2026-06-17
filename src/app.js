import express from 'express'
import session from 'express-session'
import flash from 'connect-flash'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import methodOverride from 'method-override'
import path from 'path'
import { fileURLToPath } from 'url'
import { authRoutes } from './routes/authRoutes.js'
import { snippetRoutes } from './routes/snippetRoutes.js'
import { setUserLocals } from './middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * creates and configures the Express application
 * @returns {express.Application} the configured Express application
 */
export function createApp () {
  const app = express()
  // Set EJS as the view engine and specify the views directory
  app.set('view engine', 'ejs')
  // Set the views directory to the 'views' folder in the project root
  app.set('views', path.join(__dirname, '../views'))
  // Middleware setup
  app.use(helmet({
    contentSecurityPolicy: false // Prevents header restrictions from blocking overridden form mutations locally
  }))
  // Sanitize user input to prevent NoSQL injection attacks
  app.use(mongoSanitize())
  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, '../public')))
  // Parse URL-encoded bodies (as sent by HTML forms)
  app.use(express.urlencoded({ extended: false }))
  // Override HTTP methods to support PUT and DELETE in forms
  app.use(methodOverride('_method'))
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // stops client-side scripts from reading the cookie
      httpOnly: true,
      // protects against cross-site request forgery (csrf)
      sameSite: 'lax',
      // forces https when deployed in production
      secure: process.env.NODE_ENV === 'production',
      // sets a 24-hour expiration limit
      maxAge: 1000 * 60 * 60 * 24
    }
  }))

  app.use(flash())
  // Custom middleware to set user information in response locals
  app.use(setUserLocals)
  // Middleware to set flash messages in response locals for access in views
  app.use((req, res, next) => {
    res.locals.flash = req.flash()
    next()
  })
  // redirect the root URL to the snippets page
  app.get('/', (req, res) => res.redirect('/snippets'))
  // use authentication and snippet routes
  app.use(authRoutes)
  app.use('/snippets', snippetRoutes)
  // catch-all route for handling 404 errors
  app.use((req, res) => res.status(404).render('errors/404'))
  // error-handling middleware for catching and rendering 500 errors
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).render('errors/500')
  })

  return app
}
