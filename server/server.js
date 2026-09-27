const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Verify essential security configuration
if (!process.env.JWT_SECRET) {
  console.error('[FATAL CONFIGURATION ERROR] JWT_SECRET environment variable is missing.');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware: CORS Configuration
const getOriginWhitelist = () => {
  const list = [];
  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach((url) => {
      const trimmed = url.trim();
      if (trimmed) list.push(trimmed);
    });
  }
  // Allow standard local development ports
  list.push(
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000'
  );
  return [...new Set(list)];
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = getOriginWhitelist();
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    try {
      const parsed = new URL(origin);
      // Allow all Vercel deployments (*.vercel.app and preview domains)
      if (parsed.hostname === 'vercel.app' || parsed.hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      // Allow localhost / 127.0.0.1 on any port
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch {
      // Ignore URL parsing errors
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Gateway API Status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'PathFinder API Gateway',
    documentation: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'PathFinder API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Handler for Unmatched API Routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[PathFinder Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection] ${err.message}`);
  // server.close(() => process.exit(1));
});
