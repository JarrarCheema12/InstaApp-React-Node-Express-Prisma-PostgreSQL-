import jwt from "jsonwebtoken"
export const generateJWTtoken = (tokenData) => {
    const token = jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn: "1d"})
    return token
}