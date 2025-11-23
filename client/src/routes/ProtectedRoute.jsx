import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../services/api.js'

export default function ProtectedRoute({ children, roles }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(false))
  }, [])
  if (user === null) return null
  if (user === false) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}
