import { signUpUser, findUser, findUserById, userVerify, registerUser, updateTokenRegisterUser} from "../models/userModel.js"
import { sendEmail } from "../utils/emailService.js"
export const signUp = async (userId, fullName,userName,password) => {
    try {
        const res = await signUpUser(userId, fullName,userName,password)
        return res
    } catch (error) {
        console.log(error);
        throw error 
        
    }
}

export const findExistingUser = async (userName) => {
    try {
        const res = await findUser(userName)
        return res
    } catch (error) {
        throw error
    }
}

export const findExistingUserById = async (userId) => {
    try {
        const res = await findUserById(userId)
        return res
    } catch (error) {
        throw error
    }
}

export const sendEmailService = async (email,verifyLink) => {
    try {
        return await sendEmail(email,verifyLink)
    } catch (error) {
        console.log(error);
        
    }
}
export const registerUserService = async (email, token=null, tokenExpiry=null, isVerified=false) =>{
    try {
        return await registerUser(email,token,tokenExpiry,isVerified)
    } catch (error) {
        console.log(error);
        
    }
}

export const updateTokenRegisterUserService = async (email, token, tokenExpiry) =>{
    try {
        return await updateTokenRegisterUser(email,token,tokenExpiry)
    } catch (error) {
        console.log(error);
        
    }
}
export const verifyUserService = async (token) => {
    try {
        return await userVerify(token)
    } catch (error) {
        console.log(error);
        
    }
}