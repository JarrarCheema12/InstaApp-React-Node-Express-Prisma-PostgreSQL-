import axios from "axios"


const API = "http://localhost:5000/api/v1/user";

function normalizeUser(user) {
  if (!user) return user;

  const id = user.uid ?? user.id;
  const fullname = user.fullname ?? user.fullName;
  const createdAt = user.createdAt ?? user.created_at;

  return {
    ...user,
    uid: id,
    id,
    fullname,
    fullName: fullname,
    createdAt,
    created_at: createdAt,
  };
}

export const googleRegister = async (idToken) => {
  try {
    const res = await axios.post(`${API}/googleLogin`, { idToken }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

    const userData = {
      uid: res.data.user?.id ?? res.data?.id ?? res.data.userId,
      id: res.data.user?.id ?? res.data?.id ?? res.data.userId,
      fullName: res.data.user?.fullname ?? "",
      fullname: res.data.user?.fullname ?? "",
      username: res.data.user?.username ?? "",
      email: res.data.user?.email ?? "",
      isProfileComplete: res.data.user?.isProfileComplete ?? res.data.isProfileComplete,
      isVerified: res.data.user?.isVerified ?? false,
      createdAt: Date.now(),
    };

    const normalizedUser = normalizeUser(userData);

    return {
      ...normalizedUser,
      message: res.data.message,
      success: res.data.success
    };

  } catch (error) {
    throw new Error(error.response?.data?.message || "Google login failed");
  }
};


export const register = async ({ email }) => {
  try {
    const res = await axios.post(`${API}/registerUser`, { email }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};


export const verify = async (token) => {
  try {

    const res = await axios.post(`${API}/verifyUser/${token}`, {}, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });
    
    return res.data

  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const signup = async ({ userId, fullName, userName, password }) => {
  try {

    const res = await axios.post(`${API}/signUpUser`, {
      userId,
      fullName,
      userName,
      password,
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    const userData = {
      uid: res.data.user.id,
      id: res.data.user.id,
      fullName: res.data.user.fullname,
      fullname: res.data.user.fullname,
      username: res.data.user.username,
      email: res.data.user.email,
      createdAt: Date.now(),
    };

    return normalizeUser(userData);

  } catch (error) {
    console.log(error.response?.data?.message || error.message);

  }
};


export const login = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API}/loginUser`, {
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    const user = res.data;

    return normalizeUser({
      uid: user.uid,
      id: user.uid,
      fullName: user.fullname,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      createdAt: user.created_at ?? user.createdAt,
      created_at: user.created_at ?? user.createdAt,
      friends: user.friends || [],
    });

  } catch (error) {    
    
    throw error.response?.data || "Login failed"
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.post(
      `${API}/getUser`,
      {},
      { withCredentials: true }
    );

    return normalizeUser(res.data.user);
  } catch (error) {
    throw error;
  }
};