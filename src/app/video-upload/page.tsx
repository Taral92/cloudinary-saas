"use client"
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";





export default function VideoUpload() {
    const [file,setfile]=useState<File | null>(null)
    const[title,settitle]=useState<string>("")
    const[description,setdescription]=useState<string>("")
   const [isuploaing,setisuploaing]=useState<boolean>(false)

   const router=useRouter()
   const handlefilechange=(e:React.ChangeEvent<HTMLInputElement>)=>{
       const file=e.target.files?.[0]
      setfile(file ?? null)

   }
   const handleSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
     if(!file){
        alert('file is not found')
     }
     try {
        const formdata=new FormData()
        formdata.append("file",file ?? "")
        formdata.append("title",title)
        formdata.append("description",description)
        const response=await axios.post("/api/video-upload",formdata,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        if(response.status===200){
            alert("Video uploaded successfully")
            router.push("/")
        }
        console.log(response.data)
     } catch (error) {
        if(error instanceof Error){
            console.log(error.message)
        }
     }finally{
        setisuploaing(false)
     }

   }
    return (
        <div>
            <h1>Video Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handlefilechange} />
                <input type="text" placeholder="Title" onChange={(e)=>settitle(e.target.value)} />
                <input type="text" placeholder="Desription" onChange={(e)=>setdescription(e.target.value)}/>
                <button type="submit" disabled={isuploaing}>Upload</button>
               {
                isuploaing ? "Uploading..." : "Upload"
               }
            </form>
            
        </div>
    );
}