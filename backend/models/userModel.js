import prisma from "../config/prisma.js";

export const signUpUser = async (userId, fullName, userName, password) => {

  try {
    const user = await prisma.users.update({
      where: { id: Number(userId) },
      data: {
        fullname: fullName,
        username: userName,
        password: password,
        isProfileComplete: true,
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findUser = async (email) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        fullname: true,
        username: true,
        password: true,
        isProfileComplete: true,
        isVerified: true,
        created_at: true,
      },
    });

    return user || false;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (userId) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    return user || false;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email, token = null, tokenExpiry = null, isVerified = false) => {
  try {
    const user = await prisma.users.create({
      data: {
        email: email,
        token: token,
        tokenExpiry: tokenExpiry,
        isVerified: isVerified,
        isProfileComplete: false
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        isProfileComplete: true,
        created_at: true,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateTokenRegisterUser = async (email, token, tokenExpiry) => {
  try {
    const user = await prisma.users.update({
      where: { email: email },
      data: {
        token: token,
        tokenExpiry: tokenExpiry,
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const userVerify = async (token) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        token: token,
        tokenExpiry: {
          gt: new Date()
        }
      }
    })
    if (!user) return false

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        token: null,
        tokenExpiry: null,
        isProfileComplete: false
      }

    })
    return updatedUser

  } catch (error) {
    throw error;
  }
}