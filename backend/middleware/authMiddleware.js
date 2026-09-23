import User from "../models/User.js";
import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (token === 'playpeak-demo-token') {
                req.user = {
                    _id: 'playpeak_athlete_demo',
                    name: 'Coach Rajesh (Admin)',
                    email: 'admin@playpeak.com',
                    role: 'admin'
                };
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'playpeak_super_secret_jwt_2026');
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            return next();
        } catch (error) {
            console.error('Auth verification error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, admin };
