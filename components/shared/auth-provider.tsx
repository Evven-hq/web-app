"use client"

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { LoadingScreen } from './LoadingScreen';

let restoreSessionPromise: Promise<void> | null = null;

const AuthProvider = (
  { children } : { children : React.ReactNode }
) => {

  const restoreSession = useAuthStore((state) => state.restoreSession)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
      restoreSessionPromise ??= restoreSession()
    }, [restoreSession])

  if (!isInitialized || isLoading){
    return (
      <LoadingScreen />
    )
  } 

  return <>{children}</>

}

export default AuthProvider
