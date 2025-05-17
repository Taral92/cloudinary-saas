import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ispublicroute = createRouteMatcher(["/sign-in", "/sign-up", "/home"]);
const ispublicapiroute = createRouteMatcher([
  "/api/videos",
  "/api/video-upload",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const currenturl = new URL(req.url);
  const isaccessingdashboard = currenturl.pathname === "/home";
  const isapirequest = currenturl.pathname.startsWith("api");
  if (currenturl.pathname === "/") {
    return NextResponse.redirect(
      new URL(userId ? "/home" : "/sign-in", req.url)
    );
  }
  if (userId && ispublicroute(req) && !isaccessingdashboard) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  // not logged in
  if (!userId) {
    if (!ispublicapiroute(req) && !ispublicroute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  if (currenturl.pathname.startsWith("/socialshare") && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (isapirequest && !ispublicapiroute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    "/(api|trpc)(.*)",
    "/socialshare(.*)",
  ],
};
