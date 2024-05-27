const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token.split(' ')[1],JWT_SECRET);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token.split(' ')[1], ""+JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    console.log("whats up", decoded);
    req.user = decoded;
    console.log(req.user);
    next();
  });
};

module.exports = verifyToken;
