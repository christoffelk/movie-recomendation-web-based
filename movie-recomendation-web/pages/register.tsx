import { useRouter } from "next/router";
import React from "react";
import Layout from "../layouts/Layout";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(name, email, password);
    // await fetch("", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     body: JSON.stringify({
    //       name,
    //       email,
    //       password,
    //     }),
    //   },
    // });
    await router.push("/login");
  };
  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">Register</h1>
        <input
          className="form-control"
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />
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
          Register
        </button>
      </form>
    </Layout>
  );
};

export default Register;
