import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../store/authSlice'
import axios from "axios"


export const Navbar = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);

  const API = "http://localhost:5000/api/v1/user";

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logoutUser`, {},
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        });
      dispatch(clearUser())
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  }
  return (
    <div className="flex justify-between items-center h-[10%] w-full border border-black shadow-lg bg-black">
      <img src="./download.png" height={50} width={50} />
      <ul className="flex gap-10 list-none mx-10">
        {authUser && <li className="text-white/80 text-base md:text-lg font-medium tracking-widest transform transition-all hover:scale-110 hover:shadow-2xl hover:ease-in-out"><Link to="/">Home Page</Link></li>}
        {!authUser && <li><Link to="/register" className="text-white/80 text-base md:text-lg font-medium tracking-widest ">Register</Link></li>}
        {!authUser && <li><Link to="/login" className="text-white/80 text-base md:text-lg font-medium tracking-widest ">Login</Link></li>}
        {authUser && (
          <>
            <li className="text-white/80 text-base md:text-lg font-medium tracking-widest transform transition-all hover:scale-110 hover:shadow-2xl hover:ease-in-out">Welcome, {authUser.username}</li>
            <li className="text-white/80 text-base md:text-lg font-medium tracking-widest transform transition-all hover:scale-110 hover:shadow-2xl hover:ease-in-out"><button onClick={() => handleLogout()}>Logout</button></li>
          </>
        )}
      </ul>
    </div>
  )
}