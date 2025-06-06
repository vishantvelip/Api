# API Project

This repository implements a Node.js/Express backend API with MongoDB integration. It provides endpoints and views for managing project data, file uploads, and basic server rendering using EJS.

## Features

- RESTful API built with Express
- MongoDB (via Mongoose) for database operations
- EJS templating for server-rendered views
- File upload support via Multer
- CORS configuration for API access
- Environment variable support via `.env`
- Organized structure for routes, models, middleware, and views

## Project Structure

```
.
├── api/                # (Alternative app.js found here)
├── app.js              # Main server entry point
├── routes/             # API route definitions
├── models/             # Database models (Mongoose schemas)
├── middleware/         # Express middleware
├── views/              # EJS templates for server-rendered pages
├── public/             # Static assets and uploads
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency lock file
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or remote)

### Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/vishantvelip/Api.git
   cd Api
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   CORS_ORIGINS=*
   ```

4. Start the server:
   ```sh
   node app.js
   ```

5. The API will be available at `http://localhost:8000/`.

## Usage

- Access the home page at `/`.
- API routes are prefixed with `/api`.
- Uploads are stored in `public/uploads`.
- CORS origins can be configured via the `CORS_ORIGINS` environment variable.

## Example Code Snippet

```js
const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/project");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use("/api", projectRoutes);
app.listen(port, () => console.log(`Server started at PORT: ${port}`));
```

## License

This project is licensed under the MIT License.

---

> **Note:** This is a summary based on available repo structure and code. For more details, browse the source code or open an issue if you have questions.
