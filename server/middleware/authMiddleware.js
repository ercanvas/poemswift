const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        // Skip auth check for login and register pages
        if (req.path === '/' || req.path === '/login' || req.path === '/register') {
            return next();
        }

        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.redirect('/');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.redirect('/');
    }
};

module.exports = checkAuth;
