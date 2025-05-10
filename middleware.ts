import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server"

const ispublicroute =createRouteMatcher([
    '/signin',
    '/signup',
    '/home',
    
])
const ispublicapiroute =createRouteMatcher([
    '/api/videos',
])

export default clerkMiddleware(async(auth,req)=>{
    const{userId}=await auth()
    const currenturl=new URL(req.url)
    const isaccessingdashboard=currenturl.pathname === "/home"
    const isapirequest=currenturl.pathname.startsWith('api')
      if(userId && ispublicroute(req) && !isaccessingdashboard){
        return NextResponse.redirect(new URL('/home',req.url))
      }
      // not logged in
      if(!userId){
        if(!ispublicapiroute(req) && !ispublicroute(req)){
            return NextResponse.redirect(new URL('/signin',req.url))
        }
      }
      if(isapirequest && !ispublicapiroute(req)){
        return NextResponse.redirect(new URL('/signin',req.url))
      }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};