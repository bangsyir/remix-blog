import { Form, Link } from "remix";

const Register = () => {
  return (
    <div>
      <div className="card register">
        <h2 style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>Register Account</h2>
        <Form method="post">
          <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
          </div>
          <div style={{marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center"}}>
            <button className="btn" type="submit">Register</button>
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
