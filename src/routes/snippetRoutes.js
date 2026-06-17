import { Router } from 'express'
import { snippetController } from '../controllers/snippetController.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

/**
 * defines the routes for managing snippets, including listing, creating, viewing, editing, and deleting snippets.
 */
export const snippetRoutes = Router()
// route for listing snippets, with optional search and tag filtering
snippetRoutes.get('/', asyncHandler(snippetController.index))
// route for displaying the form to create a new snippet, which requires authentication
snippetRoutes.get('/new', requireAuth, snippetController.newForm)
// route for creating a new snippet, which requires authentication and async error handling
snippetRoutes.post('/', requireAuth, asyncHandler(snippetController.create))
// route for viewing a single snippet by its ID, with async error handling
snippetRoutes.get('/:id', asyncHandler(snippetController.show))
// route for displaying the form to edit an existing snippet, which requires authentication and async error handling
snippetRoutes.get('/:id/edit', requireAuth, asyncHandler(snippetController.editForm))
// route for updating an existing snippet, which requires authentication and async error handling
snippetRoutes.put('/:id', requireAuth, asyncHandler(snippetController.update))
// route for deleting a snippet, which requires authentication and async error handling
snippetRoutes.delete('/:id', requireAuth, asyncHandler(snippetController.remove))
