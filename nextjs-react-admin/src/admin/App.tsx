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

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const postFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="userId" label="User" reference="users" />,
];
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} edit={EditGuesser} />
    <Resource name="comments" list={ListGuesser} />
  </Admin>
);

export default App;
