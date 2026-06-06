"use client"

import React from 'react'
import { useState} from 'react'
import { useAuthStore } from "@/store/auth-store"


export default function Login() {

  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await login(email, password)
    console.log("logged in")
  }

  

  return (
    <div>
        <form onSubmit= {handleSubmit} >
            <input 
              type="email"
              placeholder = "Email"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password"
              placeholder = "Password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>

        </form>
        
    </div>
  )
}
