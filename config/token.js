import jwt from "jsonwebtoken";

const genToken = async (userId) => {
    try {
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId }, secret, { expiresIn: "10d" });
        return token;
    } catch (error) {
        console.error("Token generation error:", error);
        throw error;
    }
};

export default genToken;