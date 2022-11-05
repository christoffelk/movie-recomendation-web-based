import * as React from "react";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  TextInput,
  ReferenceInput,
} from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import authProvider from "../authProvider";
import { PostList } from "../posts";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="users" list={ListGuesser} edit={EditGuesser} />
    <Resource name="comments" list={PostList} edit={EditGuesser} />
  </Admin>
);

export default App;
