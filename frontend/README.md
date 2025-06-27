# Product Manage App (React Frontend)

This is a React frontend for a Product Management application. It features user registration, login, and a dashboard for managing products. The UI uses Bootstrap 5 and Bootstrap Icons for a modern look.

## Features

- User Registration and Login
- Dashboard for product management
- Responsive Bootstrap UI
- Form validation and error handling
- React Router for navigation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
   or
   ```sh
   yarn
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```
   or
   ```sh
   yarn dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

### Backend Setup

- Make sure your backend API is running and accessible.
- By default, the frontend expects the backend at `http://localhost:5000`.
- If your backend runs on a different port, update the API URLs in your frontend code or configure a proxy in `vite.config.js`.

### Proxy Example (vite.config.js)

```js
export default {
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    }
  }
}
```

## Project Structure

```
src/
  ├── App.jsx
  ├── pages/
  │     ├── Register.jsx
  │     ├── Login.jsx
  │     └── Dashboard.jsx
  ├── main.jsx
  └── index.css
```

## Dependencies

- React
- React Router DOM
- Axios
- Bootstrap 5
- Bootstrap Icons

## Troubleshooting

- **Icons not showing?**  
  Make sure `bootstrap-icons` is installed and imported in `main.jsx`.


