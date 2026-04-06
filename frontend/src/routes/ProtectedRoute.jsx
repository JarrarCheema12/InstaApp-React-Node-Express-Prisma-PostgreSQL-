import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const authUser = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.authChecking)
  if (loading) return null
  if (!authUser) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
