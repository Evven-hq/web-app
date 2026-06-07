"use client"

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

const AuthProvider = (
  { children } : { children : React.ReactNode }
) => {

  const restoreSession = useAuthStore((state) => state.restoreSession)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
      restoreSession()
    }, [restoreSession])

  if (isLoading){
    return (
      <div>loading ...</div>
    )
  } 

  return <>{children}</>

}

export default AuthProvider