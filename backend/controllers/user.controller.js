import { signUp, findExistingUser, findExistingUserById, sendEmailService, registerUserService, verifyUserService, updateTokenRegisterUserService } from "../services/user.service.js"
import bcrypt from "bcryptjs"
import { generateJWTtoken } from "../utils/jwt.js"
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library"


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "ID Token is required", success: false })
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();

        const { email } = payload;

        const user = await findExistingUser(email)

        if (!user) {

            const response = await registerUserService(email, null, null, true)
            return res.status(200).json(
                {
                    message: "Google login Successful, you need to complete your profile now",
                    id: response.id,
                    isProfileComplete: response.isProfileComplete,
                    success: true
                }
            )
        }

        if (user) {
            if (!user.isProfileComplete) {
                return res.status(200).json(
                    {
                        message: "you need to complete your profile",
                        userId: user.id,
                        isProfileComplete: user.isProfileComplete,
                        success: false
                    }
                )
            }
        }

        const tokenData = {
            userId: user.id
        }

        const token = generateJWTtoken(tokenData)

        return res.status(201).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "Strict" }).json({
            user,
            message: "Google Login Successful, Redirecting to dashboard",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}


export const registerUser = async (req, res) => {
    try {
        const { email } = req.body

        const existingUser = await findExistingUser(email)

        if (existingUser) {

            if (!existingUser.isVerified) {

                const token = crypto.randomBytes(32).toString("hex");
                const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
                const verifyLink = `http://localhost:5173/verifyUser/${token}`
                const result = await updateTokenRegisterUserService(email, token, tokenExpiry)

                await sendEmailService(email, verifyLink)

                return res.status(200).json({
                    message: "An verification link has been sent to again your provided email. kindly check",
                    success: true
                })

            }

            if (existingUser.isVerified && !existingUser.isProfileComplete) {
                return res.status(200).json(
                    {
                        message: "you need to complete your profile",
                        userId: existingUser.id,
                        isProfileComplete: existingUser.isProfileComplete,
                        success: false
                    }
                )
            }

            if (existingUser.isVerified && existingUser.isProfileComplete) {
                return res.status(200).json(
                    {
                        message: "user already exists, login to continue",
                        userId: existingUser.id,
                        isProfileComplete: existingUser.isProfileComplete,
                        success: true
                    }
                )
            }
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const verifyLink = `http://localhost:5173/verifyUser/${token}`

        await sendEmailService(email, verifyLink)

        const regUser = await registerUserService(email, token, tokenExpiry)

        if (!regUser) {
            return res.status(500).json({ message: "Failed to register user", success: false })
        }


        return res.status(200).json({
            message: "An verification link has been sent to your provided email. kindly check",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const verifyUser = async (req, res) => {
    try {
        const { token } = req.params

        const user = await verifyUserService(token)

        if (!user) {
            return res.status(400).json(
                {
                    message: "Token expired or invalid, Rgister again",
                    success: false
                }
            )
        }

        return res.status(200).json(
            {
                user,
                message: "user verified successfully, now complete your profile to continue",
                success: "true"
            }
        )
    } catch (error) {
        console.log(error);

    }
}

export const signUpUser = async (req, res) => {
    try {
        const { userId, fullName, userName, password } = req.body

        if (!fullName || !userName || !password) {
            return res.status(500).json(
                {
                    message: "All field must be complete",
                    success: false
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await signUp(userId, fullName, userName, hashedPassword)

        if (!user) {
            return res.status(500).json({ message: "Failed to create user", success: false })
        }


        const tokenData = {
            userId: user.id
        }

        const token = generateJWTtoken(tokenData)


        return res.status(201).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "Strict" }).json({
            user,
            message: "profile completed successfully",
            success: true
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await findExistingUser(email);

        if (!user) {
            return res.status(400).json({ message: "Invalid email",  success: false });
        }

        if(!user.password){
            return res.status(400).json({ message: "You have not set your password yet, You need to complete your profile",id:user.id, success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);



        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

       

        const tokenData = { userId: user.id };
        const token = generateJWTtoken(tokenData);



        return res.status(200).cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "Strict" }).json(
            {
                uid: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                message: "User logged in successfully",
                success: true
            });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const logout = async (req, res) => {
    return res.status(200).clearCookie("token").json(
        {
            message: "User logged out successfully",
            success: true
        }
    )
}

export const getUser = async (req, res) => {
    try {
        const userId = req.user
        const user = await findExistingUserById(userId)


        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: "false"
            })
        }

        return res.status(200).json(
            {
                user,
                message: "user found successfully",
                success: true
            }
        )
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}