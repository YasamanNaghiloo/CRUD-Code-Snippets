/**
 * Wraps an asynchronous function to handle errors gracefully
 * @param {*} fn The asynchronous function to wrap
 * @returns {Function} A function that can be used as an Express middleware
 */
export function asyncHandler (fn) {
  return function (req, res, next) {
    // call the asynchronous function and catch any errors, passing them to the next middleware
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
