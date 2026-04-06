import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signup as signUpService, login as loginService, getCurrentUser as getCurrentUserService, register as registerService, verify as verifyService, googleRegister as googleRegisterService } from "../services/authService";



export const googleUserRegister = createAsyncThunk(
    "auth/registerGoogleUser",
    async (idToken, thunkAPI) => {
        try {
            const res = await googleRegisterService(idToken)
            return res
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {
            const res = await registerService(userData)
            return res
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (token, thunkAPI) => {
        try {
            const res = await verifyService(token)
            return res
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const signUpUser = createAsyncThunk(
    "auth/signUpUser",
    async (userData, thunkAPI) => {
        try {
            const res = await signUpService(userData)
            return res
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            const res = await loginService(userData)
            return res
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const checkAuthUser = createAsyncThunk(
    "auth/checkAuthUser",
    async (_, thunkAPI) => {
        try {

            const user = await getCurrentUserService();

            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue("Not authenticated");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        authChecking: true,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.loading = false
        },
        clearUser: (state, action) => {
            state.user = null
            state.loading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
            })


        builder.addCase(signUpUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            }),
            builder.addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.user = action.payload
                    state.loading = false
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.error = action.payload
                    state.loading = false
                })
        builder
            .addCase(checkAuthUser.pending, (state) => {
                state.authChecking = true;
            })
            .addCase(checkAuthUser.fulfilled, (state, action) => {
                state.authChecking = false;
                state.user = action.payload;
            })
            .addCase(checkAuthUser.rejected, (state) => {
                state.authChecking = false;
                state.user = null;
            });

    }


})

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer; 