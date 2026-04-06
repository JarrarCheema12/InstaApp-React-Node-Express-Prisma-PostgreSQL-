import './App.css'
import { RouterProvider } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, checkAuthUser } from './store/authSlice'
import { Router } from './routes/router'

function App() {

  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.auth.authChecking)

  useEffect(() => {
    dispatch(checkAuthUser())
  }, [dispatch])

  if (isLoading) return <h1 className='text-white'>Loading...</h1>

  return (

    <div className='w-full h-full'>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={Router} />
    </div>

  )
}

export default App
