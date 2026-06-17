import bcrypt from 'bcrypt'
import { User } from '../models/User.js'

/**
 * aautheentication controller
 * handles user registration, login, and logout functionality
 */
export const authController = {
  /**
   * renders the registration page
   * @param {*} req express request object
   * @param {*} res express response object
   */
  showRegister (req, res) {
    res.render('auth/register')
  },

  /**
   * handles user registration
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>}
   */
  async register (req, res) {
    const username = req.body.username?.trim().toLowerCase()
    const password = req.body.password

    if (!username || !password) {
      req.flash('error', 'Username and password are required')
      return res.redirect('/register')
    }

    const existing = await User.findOne({ username })
    if (existing) {
      req.flash('error', 'Username already exists')
      return res.redirect('/register')
    }

    const passwordHash = await bcrypt.hash(password, 12)

    try {
      const user = await User.create({ username, passwordHash })
      req.session.user = { id: user._id, username: user.username }
      req.flash('success', 'Account created successfully! Welcome.')
      res.redirect('/snippets')
    } catch (error) {
      if (error.code === 11000) {
        req.flash('error', 'Username already exists')
        return res.redirect('/register')
      }
      throw error
    }
  },

  /**
   * renders the login page
   * @param {*} req express request object
   * @param {*} res express response object
   */
  showLogin (req, res) {
    res.render('auth/login')
  },

  /**
   * handles user login
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>}
   */
  async login (req, res) {
    const username = req.body.username?.trim().toLowerCase()
    const password = req.body.password

    if (!username || !password) {
      req.flash('error', 'Username and password are required')
      return res.redirect('/login')
    }

    const user = await User.findOne({ username })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      req.flash('error', 'Invalid credentials')
      return res.redirect('/login')
    }

    req.session.user = { id: user._id, username: user.username }
    req.flash('success', 'Login successful!')
    res.redirect('/snippets')
  },

  /**
   * handles user logout
   * @param {*} req express request object
   * @param {*} res express response object
   */
  logout (req, res) {
    req.session.destroy(() => {
      res.redirect('/snippets')
    })
  }
}
