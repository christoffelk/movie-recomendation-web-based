import React from "react";
export const ratingColumns = [
  {
    field: "RatingId",
    width: 70,
  },
  {
    field: "UserId",
    headerName: "UserId",
    width: 230,
  },
  {
    field: "MovieId",
    headerName: "MovieId",
    width: 230,
  },
  {
    field: "Rating",
    headerName: "Rating",
    width: 230,
  },
];
export const movieColumns = [
  { field: "MovieId", headerName: "id", width: 70 },
  {
    field: "Title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "ReleaseDate",
    headerName: "year",
    width: 230,
  },
  {
    field: "ImageFileName",
    headerName: "image",
    width: 230,
  },
  {
    field: "Description",
    headerName: "description",
    width: 230,
  },
  {
    field: "createdAt",
    headerName: "createdAt",
    width: 230,
  },
  {
    field: "updatedAt",
    headerName: "updatedAt",
    width: 230,
  },
];
export const userColumns = [
  { field: "UserId", headerName: "id", width: 70 },
  { field: "RoleId", headerName: "RoleId", width: 70 },
  {
    field: "Email",
    headerName: "email",
    width: 230,
  },
  {
    field: "FirstName",
    headerName: "firstname",
    width: 230,
  },

  {
    field: "LastName",
    headerName: "lastname",
    width: 100,
  },
  {
    field: "UserName",
    headerName: "username",
    width: 230,
  },
  {
    field: "BirthDate",
    headerName: "Birth Date",
    width: 230,
  },
  {
    field: "Gender",
    headerName: "Gender",
    width: 230,
  },
  {
    field: "Suspended",
    headerName: "isSuspended",
    width: 230,
  },
  {
    field: "EmailVerified",
    headerName: "isVerified",
    width: 230,
  },
];

//temporary data
export const userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    age: 45,
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    age: 44,
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    age: 36,
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    age: 65,
  },
  {
    id: 10,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "active",
    age: 65,
  },
];
