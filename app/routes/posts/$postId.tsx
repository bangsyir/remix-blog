import { ActionFunction, Form, json, Link, LoaderFunction, MetaFunction, redirect, useCatch, useLoaderData, useParams, useTransition } from "remix";
// import data from "../../../data"
import type { Post } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

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
    const userId = await getUserId(request)
    const post = await db.post.findUnique({
      where: {id: Number(params.postId)}
    })
    if(!post) {
      throw new Response(
        "Can't delete what does not exist",
        {status: 404}
      )
      // user checker
    }
    if(post.authorId !== userId) {
      throw new Response("Unautorized", {status: 401})
    }
    // delete finded  post 
    await db.post.delete({where: {id: Number(params.postId)}})
    return redirect("/posts")
  }
}

const PostId = () => {
  const post = useLoaderData<Post>()
  const transition = useTransition()
  const stateDelete: "idle" | "submitting" = transition.submission ? "submitting" : "idle"

  return (
    <div>
      <div className="postHeading">
        <h3>Post</h3>
        <div style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
          <Link to="/posts" className="link">Back</Link>
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button className="delete-btn" type="submit">{stateDelete === "submitting" ? "Deleting...." : "Delete"}</button>
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

export function CatchBoundary() {
  const caught = useCatch()
  const params = useParams()
  switch (caught.status) {
    case 404:{
      return (
        <div className="errorContainer">
          <p>
            Huh? What the heck is "{params.postId}" ?
          </p>
        </div>
      )
    }
    case 401: {
      return (
        <div className="errorContainer">
          <p>
            Sorry, but {params.postId} is not your post.
          </p>
          <Link to={"/posts/"+params.postId}>Go back</Link>
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const {postId} = useParams()
  return (
    <div className="errorContainer">
      <p>
      {` There was an error loading post by the id ${postId}, Sorry.`}
      </p>
      <Link to={"/posts"}>Go back to posts</Link>
    </div>
  )
}