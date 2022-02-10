import { ActionFunction, Form, json, Link, LoaderFunction, redirect, useActionData, useSearchParams, useTransition } from "remix";
import { createUserSession, getUserSession, login } from "../utils/session.server"

export const loader:LoaderFunction = async({request}) => {
  const session = await getUserSession(request)
  if(session.get("userId")) {
    return redirect('/')
  }
  return {}
}

function validateUsername(username:unknown) {
  if(typeof username !== 'string' || username.length < 4) {
    return 'Username mus be at least 4 characters long'
  }
} 
function validatePassword(password:unknown) {
  if(typeof password !== 'string' || password.length < 6) {
    return 'Passwords must be at least 6 characters long'
  }
}

type ActionData = {
  formError?: string;
  fieldErrors? : {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string
  }
}
const badRequest = (data:ActionData) => json(data, {status:400})

export const action:ActionFunction = async({request}) => {
  await new Promise(res => setTimeout(res, 1000))
  const form = await request.formData()
  const username = form.get("username")
  const password = form.get("password")
  const redirectTo = form.get("redirectTo") || "/posts"
  if(typeof username !== 'string' || typeof password !== 'string' || typeof redirectTo !== 'string') {
    return badRequest({formError: 'Form not submitted correctly.'})
  }
  const fields = {username, password}
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  }

  if(Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }

  const user = await login({username: username.toLocaleLowerCase(), password})
  if(!user) {
    return badRequest({
      fields,
      formError: 'Username/Password combination is incorrect'
    })
  }
  return createUserSession(user.id, redirectTo)
}

const Login = () => {
  const actionData = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()
  const state: "idle" | "submitting" = transition.submission ? "submitting" : "idle" 
  return (
    <div>
      <div className="card login">
        <h2 style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>Please Login</h2>
        {state === "submitting" ? null : actionData?.formError ? (
          <span className="errorValidate">{actionData.formError}</span>
        ): null}
        <Form method="post">
          <input type="hidden" name="redirectTo" defaultValue={searchParams.get("redirectTo") ?? undefined} />
          <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" defaultValue={actionData?.fileds?.username}/>
            {state === "submitting" ? null : actionData?.fieldErrors?.username ? (
              <span className="errorValidate">{actionData.fieldErrors.username}</span>
            ): null}
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" defaultValue={actionData?.fileds?.password}/>
            {state === "submitting" ? null : actionData?.fieldErrors?.password ? (
              <span className="errorValidate">{actionData.fieldErrors.password}</span>
            ): null}
          </div>
          <div style={{marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center"}}>
            <button className="btn" type="submit">
              {state === "submitting" ? "Loading" : "Login"}
            </button>
          </div>
        </Form>
      </div>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "20px", fontSize: "small"}}>
        <Link to="/register">You don't have an account? Please Register now!</Link>
      </div>
    </div>
  );
};

export default Login;
