# PoemSwift - Interactive Poetry Game

An interactive Turkish poetry game where players match rhyming verses and compete in real-time battles.

## Features

- 🎮 Classic Mode: Match rhyming verses and earn points
- ⚔️ Battle Mode: Compete with other players in real-time
- 🏆 Leaderboard System
- 🎯 Intelligent rhyme detection
- 🌓 Dark/Light mode
- 📱 Responsive design

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: WebSocket
- Deployment: Render

## Getting Started

### Prerequisites

- Node.js >=18.0.0
- MongoDB connection
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/poemswift.git

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# NODE_ENV=development
# PORT=5000

# Start development server
npm run dev
```

### Deployment

The app is configured for deployment on Render.com. See `render.yaml` for configuration details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Authors

- Your Name - Initial work
