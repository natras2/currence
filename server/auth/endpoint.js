const express = require('express');
const { userAuthenticate } = require('./controller/authenticate');
const authRouter = express.Router();

authRouter.post('/authenticate', async (req, res) => {
    try {
        await userAuthenticate(req.user);
        res.status(200).json({ message: 'All clear. Delightful.' });
    } 
    catch(err) {
        res.status(500).json({ message: 'Error authenticating the user', error: err });
    }
});

module.exports = authRouter;