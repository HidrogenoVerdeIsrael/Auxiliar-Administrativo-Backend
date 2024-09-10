const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/verify-token', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token privado' });
  }

  jwt.verify(token, 'hayderarenas', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(200).json({ message: 'Token is valid' });
  });
});

module.exports = router;
