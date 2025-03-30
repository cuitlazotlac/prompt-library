# AI Prompt Library

A full-stack web application where users can share and discover AI prompts for various models like ChatGPT, Claude, and Gemini.

## Features

- Google OAuth authentication
- Browse and search prompts
- Create, edit, and delete your own prompts
- Upvote and favorite prompts
- Admin dashboard for content moderation
- Mobile-responsive design
- Copy prompts to clipboard
- Filter prompts by category and model type

## Tech Stack

- Frontend: React with TypeScript
- UI Framework: Material-UI
- State Management: React Query
- Backend: Firebase
  - Authentication
  - Firestore Database
  - Storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project
- Google OAuth credentials

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-prompt-library.git
cd ai-prompt-library
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable:
   - Authentication (Google sign-in)
   - Firestore Database
   - Storage

4. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts (auth, etc.)
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── config/        # Configuration files
└── theme.ts       # Material-UI theme configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Material-UI](https://mui.com/) for the UI components
- [Firebase](https://firebase.google.com/) for the backend services
- [React Query](https://tanstack.com/query/latest) for data fetching and caching # prompt-library
