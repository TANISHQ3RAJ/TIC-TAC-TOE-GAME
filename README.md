# Modern Tic Tac Toe Multiplayer Game

A fully interactive, mobile-friendly Tic Tac Toe game featuring:
- Single Player mode against AI (Easy, Medium, Hard with Minimax algorithm)
- Local Multiplayer mode
- Online Real-Time Multiplayer mode (Node.js + Socket.io)
- Modern Dark/Light theme, Smooth animations (Framer Motion)
- Win celebration with Confetti

## Requirements
- Node.js (v16+)
- NPM

## How to Run Locally

### 1. Start the Backend Server
Open a terminal and run:
```bash
cd backend
npm install
node server.js
```
*The server will start on http://localhost:3001*

### 2. Start the Frontend App
Open a separate terminal and run:
```bash
cd frontend
npm install
npm run dev
```
*The React app will be available at http://localhost:5173*

## Deployment Instructions

### Deploying the Backend (Render / Railway / Heroku)
1. Push your `backend` folder to a GitHub repository.
2. Sign up on [Render.com](https://render.com) or [Railway.app](https://railway.app).
3. Create a new "Web Service" and connect your GitHub repository.
4. Set the root directory to `backend`.
5. Start Command: `node server.js`
6. Once deployed, copy the backend URL.

### Deploying the Frontend (Vercel / Netlify)
1. Update the `SOCKET_SERVER_URL` in `frontend/src/App.jsx` from `http://localhost:3001` to your deployed Backend URL.
2. Push your `frontend` folder to a GitHub repository.
3. Sign up on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
4. Create a new project and select your `frontend` repository.
5. Framework preset: `Vite`
6. Build command: `npm run build`
7. Output directory: `dist`
8. Click Deploy.

Enjoy the game!
