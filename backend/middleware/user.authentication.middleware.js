import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided", success: false })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized, invalid token", success: false })
        }

        req.user = decoded.userId

        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, invalid token", success: false })
    }
}