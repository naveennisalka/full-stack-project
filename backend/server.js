require('./config/dotenv');
const http = require('http');
const app = require('./app');
const { connectDB } = require('./db/connection');
const { initSocket } = require('./utils/socketManager');

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initSocket(httpServer);

const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`UniConnect server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
