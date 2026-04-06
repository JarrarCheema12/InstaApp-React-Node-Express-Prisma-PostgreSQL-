import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import { registerUser, googleUserRegister, setUser as setThunkUser } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';


const EnterEmail = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.auth.loading)


  const [user, setUser] = useState({
    email: ""
  })
  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user.email) {
      alert("All fields required");
      return;
    }

    const resultAction = await dispatch(registerUser(user));

    const profileComplete = resultAction.payload.isProfileComplete
    const id = resultAction.payload.userId
    const success = resultAction.payload.success




    if (!success && !profileComplete && id) {
      toast.success(resultAction.payload.message)
      navigate(`/signup/${id}`);
    }


    if (registerUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      setUser({ email: "" });
    } else if (registerUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload);
      setUser({ email: "" });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {

    const idToken = credentialResponse.credential

    const resultAction = await dispatch(googleUserRegister(idToken))

    if (!googleUserRegister.fulfilled.match(resultAction)) {
      toast.error("Google login failed")
      return
    }

    const data = resultAction.payload

    const id = data.id
    const profileComplete = data.isProfileComplete

    if (id && !profileComplete) {
      toast.success(data.message)
      navigate(`/signup/${id}`)
      return
    }

    if (id && profileComplete) {

      dispatch(setThunkUser(data))

      toast.success(data.message)

      navigate("/")
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-8">

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 bg-white/80 rounded-full" />
            <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">Welcome to Instagram</h1>
          </div>
          <p className="text-white/25 text-sm md:text-base pl-4">Register to continue</p>
        </div>

        <form
          onSubmit={submitHandler}
          className="bg-[#111111] border border-white/[0.07] rounded-xl p-6 md:p-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-sm md:text-base font-medium tracking-wide">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ email: e.target.value })}
              className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white/80 text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3 md:py-3.5 rounded-lg text-base md:text-lg font-medium transition-all duration-200 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white"
          >
            {loading ? "Registering...." : "Sign Up"}
          </button>
        </form>

        <div className='flex justify-center'>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>
        <p className="text-center text-white/25 text-sm md:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-white/60 hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}



export default EnterEmail
