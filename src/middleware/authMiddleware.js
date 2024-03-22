import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const verifyToken = async(req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({ error: 'Missing Token, Invalid authorization' });
        return;
    }

    try {
        const decoded = jwt.verify(token, 'groupChat');
        const user = await db.User.findOne({ where: { username: decoded.username } });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};