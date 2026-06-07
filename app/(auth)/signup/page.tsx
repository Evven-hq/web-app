"use client"

import React from 'react'
import { useState} from 'react'
import { useAuthStore } from "@/store/auth-store"
import {useRouter} from 'next/navigation';



const Register = () => {
  const signup = useAuthStore((state) => state.signup)
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await signup(name, email, password)
    
    router.push("/dashboard")
  }

  return (
    <main>
        <form onSubmit= {handleSubmit} >
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            
            
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            
            <button type="submit">Sign Up</button>
        </form>
    </main>
  )
}

export default Register