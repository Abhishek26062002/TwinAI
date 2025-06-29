# Searchera Clone

A production-ready AI clone application built with React, Vite, and TailwindCSS. Create your personalized AI assistant through an intuitive 6-step wizard and share it across multiple platforms.

## Features

- **Complete Authentication System**: Secure signup/login with session management
- **6-Step Wizard Setup**: Comprehensive profile creation with real-time clone previews
- **Interactive Web Chat**: Full-featured chat interface with message history
- **Multi-Platform Sharing**: WhatsApp, Instagram, and web chat integration
- **Dark/Light Mode**: System preference detection with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Apple-inspired design with smooth animations

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: TailwindCSS with dark mode support
- **Icons**: Lucide React
- **State Management**: React hooks with sessionStorage
- **API**: REST endpoints with error handling

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev        # Runs on http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.jsx                    # Main app with routing and dark mode
├── api.js                     # API wrapper with authentication
├── hooks/
│   └── useDarkMode.js        # Dark mode hook with persistence
├── assets/
│   └── logo.svg              # Application logo
├── pages/
│   ├── LoginPage.jsx         # Authentication login
│   ├── SignupPage.jsx        # User registration
│   ├── ShareLinks.jsx        # Social sharing interface
│   └── WebChat.jsx           # Chat interface
├── wizard/
│   ├── WizardLayout.jsx      # 6-step wizard container
│   └── steps/
│       ├── Step1.jsx         # Personal information
│       ├── Step2.jsx         # Background & experience
│       ├── Step3.jsx         # Skills & expertise
│       ├── Step4.jsx         # Personality & communication
│       ├── Step5.jsx         # Goals & aspirations
│       └── Step6.jsx         # Preferences & settings
└── components/
    ├── ClonePreview.jsx      # AI clone preview dialog
    ├── ChatBubble.jsx        # Individual chat messages
    └── ChatInput.jsx         # Message input with auto-resize
```

## API Endpoints

The application expects a backend server running on `http://localhost:8000` with the following endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /profile` - Save user profile data
- `GET /profile/{uid}` - Retrieve user profile
- `POST /chat` - Send message and get AI response

## Authentication

- Uses simple sessionStorage for user ID persistence
- Automatic redirects for protected routes
- Clean logout functionality

## Design System

- **Primary Color**: Orange (#F97316 / #fb923c for dark mode)
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px grid system
- **Components**: Reusable button, input, and card classes
- **Animations**: Fade-in and slide-up transitions

## Dark Mode

- Automatic system preference detection
- Manual toggle with persistence
- Comprehensive dark variants for all components
- Smooth color transitions

## Browser Support

- Modern browsers with ES2020+ support
- Mobile responsive design
- Touch-friendly interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.