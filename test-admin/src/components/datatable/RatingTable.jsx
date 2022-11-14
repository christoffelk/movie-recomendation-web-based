import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { movieColumns, ratingColumns, userColumns, userRows,} from "../../dataTableSource";
import { Link } from "react-router-dom";
import { useState } from "react";
import React from 'react'
const RatingTable = () => {
  const [data, setData] = useState([]);
  React.useEffect(() => {
    fetch("http://localhost:5000/rating/getAll", {
      headers: {
        Authorization: "Bearer" + " " + JSON.parse(sessionStorage.getItem("token")),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data)
      });
  },[])
   

    const handleDelete = (id) => {
      setData(data.filter((item) => item.id !== id));
    };
  
    const actionColumn = [
      {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="cellAction">
              {/* <Link to="*" style={{ textDecoration: "none" }}>
                <div className="viewButton">View</div>
              </Link> */}
              <div
                className="deleteButton"
                onClick={() => handleDelete(params.row.id)}
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
          Add New Rating
          <Link to="/rating/:movieId" className="link">
            Add New
          </Link>
        </div>
        <DataGrid
          className="datagrid"
          rows={data ||[]} 
          getRowId={(row) => row.RatingId}
          columns={ratingColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>
    );
  };
  
  export default RatingTable;
