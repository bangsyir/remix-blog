import bcrypt from "bcryptjs"
import { createCookieSessionStorage, redirect } from "remix"
import { db } from "./db.server"

type LoginForm = {
  username?: string;
  password: string;
}
type RegisterForm = {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

// login user
export async function login({username, password}: LoginForm) {
  const user = await db.user.findUnique({where: {username}})
  if(!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if(!isCorrectPassword) return null 

  return user
}

export async function register({username, fullname, email, password}:RegisterForm) {
  const checkUser = await db.user.findUnique({
    where: {
      email
    }
  })
  if(checkUser) return null 
  const passwordHash = await bcrypt.hash(password,10)

  await db.user.create({
    data: {
      username: username,
      fullname: fullname,
      email: email,
      passwordHash: passwordHash
    }
  })
  return redirect('/login')
}

const sessionSecret = process.env.SESSION_SECRET 
if(!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "rb_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

// create user session
export async function createUserSession(userId:number, redirectTo: string) {
  const session = await storage.getSession()
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie" : await storage.commitSession(session)
    }
  })
}

// get user session
export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

// get user id
export async function getUserId(
  request: Request, 
  redirectTo:string = new URL(request.url).pathname
  ) {
  const session = await getUserSession(request)
  const userId = session.get("userId")
  if(!userId || typeof userId !== "number") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    return redirect(`/login${searchParams}`)
  }
  return userId
}

// get user
export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if(typeof userId !== "number") {
    return null 
  }

  try {
    const user = await db.user.findUnique({where: {id: userId}})
    return user 
  } catch (error) {
    throw logout(request)    
  }
}

// destroy user session
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"))
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  })
}

