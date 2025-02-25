import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("authenticateJWT - Auth Header:", authHeader); // Log authHeader

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log("authenticateJWT - Token:", token); // Log token
        //console.log("authenticateJWT - JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY); // Log secret key (DEBUGGING ONLY - CAUTION)

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            req.user = user;
            console.log("Decoded User from JWT:", user);
            console.log("Authenticated User:", req.user);
            next();
        });
    } else {
        console.log("authenticateJWT - No token provided");
        return res.status(401).json({ message: "No token provided" });
    }
};