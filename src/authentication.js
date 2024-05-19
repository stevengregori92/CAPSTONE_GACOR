const jwt = require('@hapi/jwt');
require('dotenv').config();

const verifyToken = (token, secretKey) => {
    try {
      const decoded = jwt.token.decode(token, secretKey);
      if (!decoded) {
        console.log("Error: Unable to decode token.");
        return { isValid: false, errorMessage: 'Invalid token structure' };
      }
  
      console.log("Decoded token:", decoded);

      if (decoded.decoded.payload.exp && decoded.decoded.payload.exp * 1000 <= Date.now()) {
        console.log("Token expired.");
        return { isValid: false, errorMessage: 'Token expired' };
      }
  
      console.log("Token is valid.");
      return { isValid: true, decoded: decoded.decoded.payload };
    } catch (error) {
      console.error("Error verifying token:", error);
      return { isValid: false, errorMessage: 'Invalid token' };
    }
  };

const authenticateUser = (request) => {
    const token = request.headers.authorization; 
    if (!token || !token.startsWith('Bearer ')) {
        console.log("Authorization header missing or does not start with 'Bearer '");
        return false;
    }

    const tokenString = token.slice(7); 
    const secretKey = process.env.JWT_SECRET;

    console.log("Token string:", tokenString);

    const validationResult = verifyToken(tokenString, secretKey);
    console.log("Validation result:", validationResult);
    
    return validationResult.isValid;
};

module.exports = authenticateUser;
