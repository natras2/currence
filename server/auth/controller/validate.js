const { getAuth } = require('firebase-admin/auth');
const admin = require('../../config/firebase');

// Middleware to check if a request is authenticated
async function validateToken(req, res, next) {
    if (!req.header('Authorization') || !req.header('Authorization').startsWith('Bearer '))
        return res.sendStatus(401);

    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.sendStatus(401);

    console.log("Decoding token...");
    getAuth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            console.log("Token decoded successfully");
            req.user = decodedToken; // adds user data to the request
            next();
        })
        .catch((err) => {
            return res.status(401).json({ error: "Invalid token: " + err });
        });
}

module.exports = {
    validateToken
};