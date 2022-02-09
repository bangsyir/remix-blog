import { Link } from "remix";

const BlogCard = (
  {post}:
  {post: {
    id:number, 
    title: string, 
    createdAt: string 
  }}) => {
  return (
    <Link to={"/posts/"+post.id} className="link">
      <div className="card">
        <p className="cardTitle">{post.title}</p>
        <p className="cardDate">{post.createdAt}</p>
      </div>
    </Link>
  )
};

export default BlogCard;
