import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if logged-in user is a manager
const isManager = (req, res, next) => {
  if (!req.user || (req.user.role !== 'manager' && req.user.work !== 'manager')) {
    return res.status(403).json({ error: 'Access denied. Managers only.' });
  }
  next();
};

// Function to generate JWT token
const generateToken = (user) => {
  const userRole = (user.role === 'manager' || user.work === 'manager') ? 'manager' : (user.role || 'staff');
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: userRole,
      work: user.work
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
};

export { jwtAuthMiddleware, isManager, generateToken };