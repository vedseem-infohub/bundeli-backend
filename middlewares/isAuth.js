import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        // Extract token from httpOnly cookie or Authorization Bearer header
        const tokenFromCookie = req.cookies?.token;
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            return res.status(401).json({ message: "Authentication required. Please sign in." });
        }

        const secret = process.env.JWT_SECRET || "bundeli_heritage_jwt_secret_key_orchha_2026";
        const decoded = jwt.verify(token, secret);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error?.message);
        return res.status(401).json({ message: "Invalid or expired session. Please sign in again." });
    }
};

export default isAuth;

