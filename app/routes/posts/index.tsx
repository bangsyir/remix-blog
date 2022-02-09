import BlogCard from "../../components/BlogCard"
// import data from "../../../data"
import { json, Link, LoaderFunction, useLoaderData } from "remix";
import {db} from "../../utils/db.server"
import type {Post} from "@prisma/client"

export const loader:LoaderFunction = async() => {
  const data = await db.post.findMany({orderBy: {createdAt: 'desc'}})
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