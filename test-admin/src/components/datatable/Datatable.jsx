import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows,} from "../../dataTableSource";
import { Link } from "react-router-dom";
import { useState } from "react";
import React from 'react'
const Datatable = () => {
  const [data, setData] = useState([]);
 

  function deleteUser(id){
    return fetch(`http://localhost:5000/user/${id}`,{
      method:'DELETE',
      headers: {
        Authorization: "Bearer" + " " + JSON.parse(sessionStorage.getItem("token")),
      },

    })
  }
  React.useEffect(() => {
    fetch("http://localhost:5000/user", {
      headers: {
        Authorization: "Bearer" + " " + JSON.parse(sessionStorage.getItem("token")),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data)
      });
  },[])
   

    const handleDelete = (params) => {
      deleteUser(params)
    };
  
    const actionColumn = [
      {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="cellAction">
              <Link to={`/users/${params.row.UserId}`} style={{ textDecoration: "none" }} >
                <div className="viewButton">View</div>
              </Link>
              <div
                className="deleteButton"
                onClick={() => handleDelete(params.row.UserId)}
              >
                Delete
              </div>
            </div>
          );
        },
      },
    ];
    return (
      <div className="datatable">
        <div className="datatableTitle">
          Add New User
          <Link to="/users/new" className="link">
            Add New
          </Link>
        </div>
        <DataGrid
          className="datagrid"
          rows={data ||[]} 
          getRowId={(row) => row.UserId}
          columns={userColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>
    );
  };
  
  export default Datatable;