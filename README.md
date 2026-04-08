# Book Store

A full-stack book store web application built with React and Express.js, backed by a PostgreSQL database. The frontend uses Redux for state management and Vite for fast development builds. The project was completed for Tampere University sql-database focused project course in 3-person dev team.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Redux + Redux Thunk |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (pg, pg-promise, PL/pgSQL) |
| HTTP Client | Axios |
| Security | Helmet, CORS |
| Config | dotenv |

---

## Project Structure

```
book-store/
├── src/              # React frontend source
├── db/               # Database connection and query helpers
├── sql/              # SQL scripts and PL/pgSQL stored procedures
├── utils/            # Shared utility functions
├── backend.js        # Express.js server entry point
├── index.html        # HTML entry point for Vite
├── vite.config.js    # Vite configuration
├── package.json
└── .gitignore
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally or remotely
- A `.env` file in the project root (see below)

---

## Environment Variables

Create a `.env` file in the root of the project:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Run the SQL scripts in the `sql/` folder to create the schema and seed data:

```bash
psql -U postgres -d bookstore -f sql/schema.sql
```

### 3. Start the backend

```bash
npm start
```

The Express API will run on `http://localhost:3000` (or the port defined in `.env`).

### 4. Start the frontend (development)

In a separate terminal:

```bash
npm run dev
```

The Vite dev server will run on `http://localhost:5173` by default.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm start` | Start the Express backend server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## License

This project does not currently specify a license.
