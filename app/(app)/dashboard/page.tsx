"use client"

import { useAuthStore } from '@/store/auth-store';
import React from 'react'

const Dashboard = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <li>
        <ul>User Tag : {user?.user_code}</ul>
        <ul>Email : {user?.email}</ul>
        <ul>Profile Picture : {user?.profile_picture ? user?.profile_picture : "No profile picture"}</ul>
      </li>
    </div>
  )
}

export default Dashboard