const { verifyToken } = require("../utils/token");

const authHandler = (req, res, next) => {
    const authorization = req.headers.authorization;


    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "Incorrect token" });
    }

    try {
        const token = authorization.split(" ")[1];
        const user = verifyToken(token);
        if (!user) {
            return res.status(401).json({ message: "Incorrect token" });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Server side error" + err.message })
    }

}
const restrictTo = (allowed = []) => {
    return (req, res, next) => {
      
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}


module.exports = {
    authHandler,
    restrictTo
}