import type { NextPage } from "next";
import Layout from "../layouts/Layout";
import React, { useState } from "react";
const Home: NextPage = () => {
  const [auth, setAuth] = useState(false);
  return <Layout>Home</Layout>;
};

export default Home;
