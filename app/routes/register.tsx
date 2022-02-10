import {ActionFunction, useTransition} from "remix"
import { json, redirect, useActionData } from "remix";
import { Form, Link } from "remix";
import validator from "validator"
import { db } from "~/utils/db.server";
import { register } from "~/utils/session.server";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: any | undefined;
    fullname: string | undefined;
    email: any | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string | undefined;
    fullname: string | undefined;
    email: string | undefined;
    password: string | undefined;
  }
}
// check username validate 
// check an username record from database
async function validateUsername(username: string) {
  if(typeof username !== 'string' || username.length < 6) {
    return "Username must be at least 6 characters long"
  } 
  const uname = await db.user.findUnique({where: {username: username}})
  if(uname) return "Username is already taken"
}
// check full name
function validateFullname(fullname:string) {
  if(typeof fullname !== 'string' || fullname.length < 6) {
    return "Username must be at least 6 characters long"
  }
}
// check email validate 
// check record an email from database
async function validateEmail(email: string) {
  if(validator.isEmail(email) === false) {
    return "Please enter a valid email"
  } 
  const checkEmail = await db.user.findUnique({where: {email}})
  if(checkEmail) {
    return "Email is already taken"
  }
}
function validatePassword(password:string) {
  if(typeof password !== 'string' || password.length < 6) {
    return "Username must be at least 6 characters long."
  }
}
// catch badRequest and return error
const badRequest = (data:ActionData) => json(data, {status:400}) 

// action from <Form></Form> 
export const action: ActionFunction = async({request}) => {
  await new Promise(res => setTimeout(res, 1000))

  const form = await request.formData()
  const username = form.get("username")
  const fullname = form.get("fullname")
  const email = form.get("email")
  const password = form.get("password")

  if(typeof username !== 'string' || typeof fullname !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return badRequest({formError: "Form not submitted correctly."})
  }

  const fields = {username, fullname, email, password}
  const fieldErrors = {
    username: await validateUsername(username),
    fullname: validateFullname(fullname),
    email: await validateEmail(email),
    password: validatePassword(password)
  }
  if(Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }
  const newUser = await register({
    username: username.toLowerCase(),
    fullname: fullname.toLowerCase(),
    email: email,
    password:password
  })
  return newUser
}

const Register = () => {
  const actionData = useActionData()
  const transition = useTransition()
  const state: "idle" | "submitting" = transition.submission ? "submitting" : "idle" 
  return (
    <div>
      <div className="card register">
        <h2 style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>Register Account</h2>
        {state === "submitting" ? null : actionData?.formError ? (
          <span className="errorValidate">{actionData?.formError}</span>
        ): null}
        <Form method="post">
          <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" />
            {state === "submitting" ? null : actionData?.fieldErrors?.username ? (
              <span className="errorValidate">{actionData?.fieldErrors?.username}</span>
            ): null}
          </div>
          <div className="inputGroup">
            <label htmlFor="fullname">Fullname</label>
            <input type="text" name="fullname" />
            {state === "submitting" ? null : actionData?.fieldErrors?.fullname ? (
              <span className="errorValidate">{actionData?.fieldErrors?.fullname}</span>
            ): null}
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" required={false}/>
            {state === "submitting" ? null : actionData?.fieldErrors?.email ? (
              <span className="errorValidate">{actionData?.fieldErrors?.email}</span>
            ): null}
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
            {state === "submitting" ? null : actionData?.fieldErrors?.password ? (
              <span className="errorValidate">{actionData?.fieldErrors?.password}</span>
            ): null}
          </div>
          <div style={{marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center"}}>
            <button className="btn" type="submit">{state === "submitting" ? "Registering..." : "Register" }</button>
          </div>
        </Form>
      </div>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "20px", fontSize: "small"}}>
        <Link to="/login">Do you have an account? please login!</Link>
      </div>
    </div>
  );
};

export default Register;
