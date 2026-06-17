/**
 * ensures that the user is authenticated
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next middleware function
 * @returns {void} calls next() if the user is authenticated, or sends a 403 response if not
 */
export function requireAuth (req, res, next) {
  // if there is no user in the session, the user is not authenticated
  if (!req.session.user) {
    return res.status(403).render('errors/403')
  }
  // if the user is authenticated, call the next middleware
  next()
}

/**
 *sets the currentUser local variable for the response
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next middleware function
 * @returns {void} sets the currentUser local variable and calls next()
 */
export function setUserLocals (req, res, next) {
  // set the currentUser local variable to the user in the session, or null if there is no user
  res.locals.currentUser = req.session.user || null
  next()
}
