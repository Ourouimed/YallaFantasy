const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? (process.env.ALLOW_CORS_URL || 'https://your-frontend-domain.vercel.app') : 'http://localhost:3000',

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};


module.exports = corsOptions