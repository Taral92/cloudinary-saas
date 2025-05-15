"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

function Home() {
    const router=useRouter()
  return (
    <div>
      <div>
        <button onClick={()=>router.push("/socialshare")}>Image Upload</button>
      </div>
      <div>
        <button onClick={()=>router.push("/video-upload")}>Video Upload</button>
      </div>
    </div>
  )
}

export default Home;