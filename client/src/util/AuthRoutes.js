import React from 'react'
import { Navigate } from 'react-router-dom'
function PublicRoute ({ isSignedIn, children }) {
  if (isSignedIn) {
    return <Navigate to="/" replace />
  }
  return children
}

function PrivateRoute ({ isSignedIn, children }) {
  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }
  return children
}

export  {PrivateRoute, PublicRoute}