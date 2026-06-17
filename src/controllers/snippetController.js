import { Snippet } from '../models/Snippet.js'

/**
 * escapes special characters in a string for use in a regular expression
 * @param {*} str the input string to escape
 * @returns {string} the escaped string safe for use in a regular expression
 */
function escapeRegex (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * parses a comma-separated string of tags into an array of unique, trimmed, lowercase strings
 * @param {*} raw the input string of tags
 * @returns {string[]} the array of parsed tags
 */
function parseTags (raw) {
  return (raw || '')
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
    .slice(0, 20) // small safety limit
}

/**
 * snippet controller
 * handles CRUD operations for code snippets, including listing, showing, creating, editing, and deleting snippets
 */
export const snippetController = {
  /**
   * renders the index page with a list of snippets
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>} resolves when the page is rendered with the list of snippets, or sends a 404 response if no snippets are found
   */
  async index (req, res) {
    const search = (req.query.search || '').trim()
    const tag = (req.query.tag || '').trim().toLowerCase()

    const filter = {}
    // if a tag is provided, filter snippets by that tag
    if (tag) {
      filter.tags = tag
    }
    // if a search query is provided, filter snippets by title, language, code, or tags that match the search term
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i')
      filter.$or = [
        { title: rx },
        { language: rx },
        { code: rx },
        { tags: rx }
      ]
    }
    // find snippets that match the filter and populate the owner field
    const snippets = await Snippet.find(filter).populate('owner')

    res.render('snippets/index', {
      snippets,
      search,
      tag,
      showSearch: true
    })
  },

  /**
   * renders the show page for a single snippet
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>} resolves when the page is rendered, or sends a 404 response if the snippet is not found
   */
  async show (req, res) {
    const snippet = await Snippet.findById(req.params.id).populate('owner')
    if (!snippet) return res.status(404).render('errors/404')
    res.render('snippets/show', { snippet })
  },
  /**
   * renders the form for creating a new snippet
   * @param {*} req express request object
   * @param {*} res express response object
   */
  newForm (req, res) {
    res.render('snippets/new')
  },
  /**
   * creates a new snippet
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>} resolves when the snippet is created and the user is redirected to the snippets page
   */
  async create (req, res) {
    const { title, code, language } = req.body
    const tags = parseTags(req.body.tags)

    await Snippet.create({
      title,
      code,
      language,
      tags,
      owner: req.session.user.id
    })

    req.flash('success', 'Snippet created successfully!')

    res.redirect('/snippets')
  },

  /**
   * renders the form for editing an existing snippet
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>} resolves when the page is rendered, or sends a 404 response if the snippet is not found
   */
  async editForm (req, res) {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) return res.status(404).render('errors/404')
    // only the owner of the snippet can edit it
    if (snippet.owner.toString() !== req.session.user.id) {
      return res.status(403).render('errors/403')
    }

    res.render('snippets/edit', { snippet })
  },

  /**
   * updates an existing snippet
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>} resolves when the snippet is updated and the user is redirected to the snippet page
   */
  async update (req, res) {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) return res.status(404).render('errors/404')
    // only the owner of the snippet can update it
    if (snippet.owner.toString() !== req.session.user.id) {
      return res.status(403).render('errors/403')
    }

    // update the snippet fields with the new values from the form
    snippet.title = req.body.title
    snippet.code = req.body.code
    snippet.language = req.body.language
    snippet.tags = parseTags(req.body.tags)

    await snippet.save()
    req.flash('success', 'Snippet updated successfully!')
    res.redirect(`/snippets/${snippet._id}`)
  },

  /**
   * removes an existing snippet
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {Promise<void>} resolves when the snippet is removed and the user is redirected to the snippets page
   */
  async remove (req, res) {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) return res.status(404).render('errors/404')
    // only the owner of the snippet can delete it
    if (snippet.owner.toString() !== req.session.user.id) {
      return res.status(403).render('errors/403')
    }

    await snippet.deleteOne()
    req.flash('success', 'Snippet deleted successfully!')
    res.redirect('/snippets')
  }
}
