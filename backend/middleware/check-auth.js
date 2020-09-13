const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, 'e8dy65uEaMcRxE7uasjo213dajksb');
    next();
  }
  catch(error) {
    response.status(401).json({ message: 'Auth failed!' });
  }
}
