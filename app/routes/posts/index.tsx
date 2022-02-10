import BlogCard from "../../components/BlogCard"
// import data from "../../../data"
import { json, Link, LoaderFunction, useCatch, useLoaderData } from "remix";
import {db} from "../../utils/db.server"
import type {Post} from "@prisma/client"

export const loader:LoaderFunction = async() => {
  const data = await db.post.findMany({orderBy: {createdAt: 'desc'}})
  if(!data) {
    throw new Response("No posts found", {status:404})
  }
  return json(data)
}

export default function Index() {
  const posts = useLoaderData<[Post]>()
  return (
    <div>
      <div className="postHeading">
        <h3>Posts</h3>
        <Link to="/" className="link">Back</Link>
      </div>
      <hr />
      {posts.map((item:any)=> (
        <BlogCard post={item} key={item.id}/>
      ))}
    </div>
  );
}
export function ErrorBoundary() {
  return (
    <div className="errorContainer">
      <p>
      {` There was an error loading posts, Sorry.`}
      </p>
      <Link to={"/"}>Go back to Home</Link>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  if(caught.status === 404) {
    return (
      <div className="error-container">
        There are no posts to display.
      </div>
    )
  }
}