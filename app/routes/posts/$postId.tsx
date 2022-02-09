import { ActionFunction, Form, json, Link, LoaderFunction, MetaFunction, redirect, useLoaderData, useTransition } from "remix";
// import data from "../../../data"
import type { Post } from "@prisma/client";
import { db } from "~/utils/db.server";

// loader data
export const loader:LoaderFunction = async({params}) => {
  const {postId} = params
  // const post = data.find((item:any) => item.id == postId)
  const post = await db.post.findUnique({
    where: {
      id: Number(postId)
    }
  })
  if(!post) throw new Error("Joke not found")
  return json(post)
}
export const meta: MetaFunction = (parentsData) => {
  const {data} = parentsData
  return {
    title: data?.title,
    description: data?.description
  }
}

export const action:ActionFunction = async({request, params}) => {
  await new Promise(res => setTimeout(res, 1000))
  const form = await request.formData()
  if(form.get('_method') === 'delete') {
    const post = await db.post.findUnique({
      where: {id: Number(params.postId)}
    })
    if(!post) {
      throw new Response(
        "Can't delete what does not exist",
        {status: 404}
      )
    }
    // user checker
    // delete finded  post 
    await db.post.delete({where: {id: Number(params.postId)}})
    return redirect("/posts")
  }
}

const PostId = () => {
  const post = useLoaderData<Post>()
  const transition = useTransition()
  const state: "idle" | "submitting" = transition.submission ? "submitting" : "idle"

  return (
    <div>
      <div className="postHeading">
        <h3>Post</h3>
        <div style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
          <Link to="/posts" className="link">Back</Link>
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button className="delete-btn" type="submit">{state === "submitting" ? "Deleting...." : "Delete"}</button>
          </Form>
        </div>
      </div>
      <p className="postTitle">{post.title}</p>
      <p className="postDate">{post.createdAt}</p>
      <p className="postDesc">{post.description}</p>
    </div>
  );
};

export default PostId;
