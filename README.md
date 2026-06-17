# B2 CRUD

A CRUD web application for programming code snippets.

## Requirements

- Node.js and npm
- MongoDB (Atlas or local)
- `npm install` to install dependencies

## Install and run

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with these values:

```env
MONGODB_URI=<your-mongo-uri>
SESSION_SECRET=<a-secret-string>
PORT=3000
```

4. Start the app:

```bash
npm start
```

5. Open the app in a browser:

```text
http://localhost:3000
```

## Environment setup

### Option 1: Local MongoDB (recommended for evaluation)

Use a local MongoDB instance if you have it installed.

Set `.env` as:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/b2-crud
SESSION_SECRET=change-this-secret
PORT=3000
```

### Option 2: MongoDB Atlas

If you prefer Atlas, use your own Atlas connection string.

1. Create a MongoDB Atlas cluster.
2. Add your current IP to Network Access.
3. Create a database user.
4. Copy the connection URI and put it in `.env`.

Example:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/snippetsdb?retryWrites=true&w=majority
SESSION_SECRET=change-this-secret
PORT=3000
```

> Important: Do not commit `.env` to Git. The real `.env` file is ignored by `.gitignore`.

## Teacher / evaluator instructions

To evaluate the project, create a `.env` file with a working MongoDB connection.

- Local MongoDB is easiest for evaluation.
- If using Atlas, add the evaluator IP to the Atlas network whitelist or allow access from all IPs temporarily.
- The app uses plain `express-session` for authentication and authorization.
- No Passport or external auth library is required.

## Scripts

- `npm start` — start the application
- `npm run lint` — run HTML, CSS, and ESLint checks
- `npm test` — alias for `npm run lint`

## Notes

- `.env.example` is provided as a template for configuration.
- The repo uses MVC structure with `src/models`, `src/controllers`, `src/routes`, and `views`.

# Presentation Video
Please open the Presentation.mp4 file that I have provided in this folder
