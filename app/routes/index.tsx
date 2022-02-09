import { Link } from "remix";

export default function Index() {
  return (
    <div style={{display:"flex", flexDirection:"column" ,justifyContent:"center", alignItems:"center", paddingTop:"25%"}}>
      <h1>
        welcome To Our Blog
      </h1>
      <Link to="/posts">Go to Posts</Link>
    </div>
  );
}
