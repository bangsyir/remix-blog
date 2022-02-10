import { useRef, useEffect, useState } from "react";
import { 
  ActionFunction, 
  Form, 
  json, 
  Link, 
  LoaderFunction, 
  redirect, 
  useActionData, 
  useLoaderData, 
  useTransition } from "remix";
  import type {Post} from "@prisma/client"
  import {db} from "../../utils/db.server"
import { getUserId, getUserSession } from "~/utils/session.server";

// title validate
function validateTitle(title: string) {
  if(typeof title !== 'string' || title.length < 5) {
    return 'Title must be at least 5 characters'
  }
}

function validateDescription(description: string) {
  if(typeof description !== 'string' || description.length < 10) {
    return 'Description must be at least 10 characters'
  }
}

type ActionData = {
  formError?: string | undefined;
  fieldErrors?: {title: string | undefined; description: string | undefined};
  fields?: {
    title?: string; 
    description?: string;
  } | undefined
}

const badRequest = (data:ActionData) => json(data, {status:400}) 

export const action:ActionFunction = async({request}) => {

  await new Promise(res => setTimeout(res, 1000))

  const form = await request.formData();
  const title = form.get("title")
  const description = form.get("description")
  const userId = await getUserId(request)
  if(
    typeof title !== 'string' || 
    typeof description !== 'string'
    ) {
    return badRequest({formError: 'Form not submited Correctly'})
  }
  const fields = {title, description}

  const fieldErrors = {
    title: validateTitle(title),
    description: validateDescription(description)
  }

  if(Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }

  // save fields to database
  const post = await db.post.create({data: {...fields, authorId: Number(userId)}})
  return redirect(`/posts/${post.id}`)
}

export const loader:LoaderFunction = async({request}) => {
  const session = await getUserSession(request)
  const userId = session.get("userId")
  if (!userId) return redirect('/login')
  return {userId}
} 

const New = () => {
  const actionData = useActionData<ActionData>()
  const data = useLoaderData()
  const transition = useTransition()
  const upload: "idle" | "submitting" = transition.submission ? "submitting" : "idle"
  const [read, setRead] = useState<string>("")
  let titleRef = useRef<HTMLInputElement>(null)
  let descRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if(actionData?.fieldErrors?.title) {
      titleRef.current?.focus()
    } else if(actionData?.fieldErrors?.description) {
      descRef.current?.focus()
    }
  },[actionData])
  const readInput = (data: string) => {
    setRead(data)
  }
  return (
    <div>
      <div className="postHeading">
        <h3>New Post</h3>
        <Link to="/posts" className="link">Back</Link>
      </div>
      <hr />
      {upload === "submitting" ? null : actionData?.formError ? (
        <span className="errorValidate">
          {actionData.formError}
        </span>
      ): null}
      <Form method="post">
        <input type="hidden" name="userId" defaultValue={data.userId}/>
        <div className="inputGroup">
          <label htmlFor="title">Title</label>
          <input 
          type="text" 
          name="title" 
          ref={titleRef}
          placeholder="title" 
          onChange={(e) => readInput(e.target.value)}
          defaultValue={actionData?.fields?.title}
          aria-labelledby={
            actionData?.fieldErrors?.title ? "title-error" : undefined
          }
          />
        </div>
        {upload === "submitting" ? null : actionData?.fieldErrors?.title ? (
          <span className="errorValidate" role="alert" id="title-error">
            {actionData.fieldErrors.title}
          </span>
        ): null}
        <div>
          <span style={read.length < 5 ? {color: "red"}: {color: "inherit"}}>{read.length}</span>&nbsp;Characters
        </div>
        <div className="inputGroup">
          <label htmlFor="description">Description</label>
          <textarea 
          name="description" 
          rows={10} 
          ref={descRef}
          placeholder="Descripiton something about title....." 
          defaultValue={actionData?.fields?.description}
          aria-labelledby={
            actionData?.fieldErrors?.description ? "description-error" : undefined
          }
          />
        </div>
        {upload === "submitting" ? null : actionData?.fieldErrors?.description ? (
          <span className="errorValidate" role="alert" id="description-error">
            {actionData.fieldErrors.description}
          </span>
        ): null}
        <div>
          <button className="btn mt-2" type="submit">
            {upload === "submitting" ? "Loading..." : "Submit"}
          </button>
        </div>
      </Form>
    </div>
  )
};

export default New;
