import { useRouter } from "next/router";
import React from "react";
import Layout from "../layouts/Layout";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(email, password);
    // await fetch("", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //      credentials: 'include'
    //     body: JSON.stringify({
    //
    //       email,
    //       password,
    //     }),
    //   },
    // });
    await router.push("/");
  };
  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">Sign In</h1>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
      </form>
      ;
    </Layout>
  );
};

export default Login;
