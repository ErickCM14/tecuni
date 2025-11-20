module.exports = (req, res, next) => {
    try {
        req.user = {
            id: req.headers['x-user-id'],
            email: req.headers['x-user-email'],
            roles: JSON.parse(req.headers['x-user-roles'] || '[]')
        };

        next();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid headers' });
    }
};
