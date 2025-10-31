<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# miniTickupapp - Simplified TickUp Application

This is a simplified frontend application for the TickUp system, featuring core OKR (Objectives and Key Results) management functionality.

View your app in AI Studio: https://ai.studio/apps/drive/1IyOxEIK-k-9ifGiAkoJiNsBuOxzKNFje

## Features

- **OKR Management**: Create, view, and manage Objectives and Key Results
- **Real-time Sync**: Socket.io based real-time communication with backend
- **MobX State Management**: Reactive state management for seamless UI updates
- **AI Integration**: Gemini AI-powered features for smart suggestions
- **User Authentication**: Login and user management
- **Responsive Design**: Works on desktop and mobile devices

## Backend Repository

This frontend connects to the backend at: **[@nikpz/Tickappback](https://github.com/nikpz/Tickappback)**

The backend provides:
- Socket.io API for all data operations
- PostgreSQL database with Sequelize ORM
- JWT-based authentication
- Real-time data synchronization

## Prerequisites

- **Node.js** (v14 or higher)
- **Backend Server** running at `http://localhost:3000` (see [nikpz/Tickappback](https://github.com/nikpz/Tickappback))

## Run Locally

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

> Note: We use `--legacy-peer-deps` due to React 19 compatibility with mobx-react-lite

### 2. Configure Environment Variables

Set the `VITE_GEMINI_API_KEY` and `VITE_SOCKET_URL` in `.env.local`:

```bash
# Backend Socket.io URL
VITE_SOCKET_URL=http://localhost:3000

# Gemini API Key for AI features
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Backend

Before running this app, make sure the backend is running:

```bash
# Clone and setup backend
git clone https://github.com/nikpz/Tickappback.git
cd Tickappback
npm install
# Configure .env with your PostgreSQL database
npm start
```

The backend should be running on `http://localhost:3000`

### 4. Run the Frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Architecture

### Frontend Stack
- **React 19**: Latest React features
- **TypeScript**: Type-safe development
- **MobX**: State management
- **Socket.io-client**: Real-time communication
- **Vite**: Fast build tool and dev server
- **Google Generative AI**: AI-powered features

### State Management
The app uses MobX with two main stores:
- `DataStore`: Manages all data (users, objectives, key results) and backend communication
- `UiStore`: Manages UI state (modals, selected items, etc.)

### Backend Communication
All communication with the backend happens through Socket.io events:
- **Authentication**: `login`, `authenticate`
- **Objectives**: `objectives:list`, `objectives:create`, `objectives:update`, `objectives:delete`
- **Key Results**: `keyResults:create`, `keyResults:update`, `keyResults:delete`
- **Check-ins**: `krCheckins:create`
- **Users**: `users:list`, `users:update`

## Key Components

- **App.tsx**: Main application component
- **DashboardPage.tsx**: OKR dashboard view
- **ObjectiveSidePanel.tsx**: Detailed objective view with key results
- **Sidebar.tsx**: Navigation sidebar
- **Header.tsx**: Top navigation header

## Project Structure

```
miniTickupapp/
├── components/          # React components
├── stores/             # MobX stores (DataStore, UiStore)
├── services/           # API services (geminiService, socketService)
├── utils/              # Utility functions
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## Troubleshooting

### Cannot connect to backend
- Ensure the backend is running on `http://localhost:3000`
- Check that `VITE_SOCKET_URL` in `.env.local` is correct
- Verify PostgreSQL database is running and configured

### Build errors
- Try cleaning node_modules: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
- Ensure you're using Node.js v14 or higher

### Socket connection issues
- Check browser console for Socket.io connection errors
- Verify CORS is properly configured in the backend
- Ensure no firewall is blocking port 3000

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
