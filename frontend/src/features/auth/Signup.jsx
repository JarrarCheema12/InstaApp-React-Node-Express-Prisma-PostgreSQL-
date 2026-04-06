import React, { useEffect, useState, useRef, use } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { signUpUser, verifyUser } from '../../store/authSlice'

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useParams()
  const { id } = useParams()
  const toastshow = useRef(false)
  const [userId, setUserId] = useState(0)


  useEffect(() => {
    const verifyAccount = async () => {

      if (id) {
        setUserId(id);
        return;
      }
      if (token) {
        const resultAction = await dispatch(verifyUser(token));        

        if (verifyUser.fulfilled.match(resultAction)) {
          setUserId(resultAction.payload.user.id);
          if (!toastshow.current) {
            toast.success(resultAction.payload.message);
            toastshow.current = true;
          }
        } else if (verifyUser.rejected.match(resultAction)) {
          if (!toastshow.current) {
            toast.error(resultAction.payload);
            toastshow.current = true;
            navigate("/register")
          }
        }
      }

    };

    verifyAccount();
  }, [token, id, dispatch, navigate]);
  const { loading, error } = useSelector((state) => state.auth)
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    password: ""
  })

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!userId) {
      toast.error("Invalid user. Please verify again.")
      return
    }

    if (!user.userName || !user.password || !user.fullName) {
      alert("All fields required")
      return
    }

    const resultAction = await dispatch(signUpUser({ userId, ...user }))

    if (signUpUser.fulfilled.match(resultAction)) {
      toast.success(`Profile completion successful! Welcome ${user.fullName}`);
      setUser({ fullName: "", userName: "", password: "" });
    } else {
      toast.error(resultAction.payload || "SignUp Failed");
    }
    setUser({ fullName: "", userName: "", password: "" })
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-8">

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 bg-white/80 rounded-full" />
            <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">Complete your Profile</h1>
          </div>
          <p className="text-white/25 text-sm md:text-base pl-4">Join and get started</p>
        </div>

        <form
          onSubmit={submitHandler}
          className="bg-[#111111] border border-white/[0.07] rounded-xl p-6 md:p-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-sm md:text-base font-medium tracking-wide">Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white/80 text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-sm md:text-base font-medium tracking-wide">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
              className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white/80 text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-sm md:text-base font-medium tracking-wide">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white/80 text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3 md:py-3.5 rounded-lg text-base md:text-lg font-medium transition-all duration-200 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

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
export default Signup
