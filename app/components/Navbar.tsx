import { Form, Link} from "remix";

const Navbar = ({user}:{user:any}) => {
  return (
    <nav className="navbar" style={{fontFamily: "Roboto, sans-serif"}}>
      <Link to="/" className="logo">
        Remix Blog
      </Link>
      <ul className="nav">
        <li className="navItem">
          <Link to="/posts" className="navLink">Posts</Link>
        </li>
        {user ? (
          <>
            <li className="navItem">
              <Link to="/posts/new" className="navLink">New</Link>
            </li>
            <li className="navItem">
              <Form method="post" action="/logout">
                <button type="submit" className="logoutBtn">
                  {user.username}, Logout
                </button>
              </Form>
            </li>
          </>
        ):(
          <li className="navItem">
            <Link to="/login" className="navLink">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  )
};

export default Navbar;
