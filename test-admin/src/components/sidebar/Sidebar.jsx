import { Link } from "react-router-dom"
import "./sidebar.scss"

const Sidebar = () => {
    return (
        <div className="sidebar">
        <div className="top">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Movie admin</span>
          </Link>
        </div>
        <hr />
        <div className="center">
          <ul>
            <p className="title">MAIN</p>
            <li>
              <span>Dashboard</span>
            </li>
            <p className="title">LISTS</p>
            <Link to="/users" style={{ textDecoration: "none" }}>
              <li>
                <span>Users</span>
              </li>
            </Link>
            <Link to="/rating" style={{ textDecoration: "none" }}>
              <li>
                
                <span>Ratings</span>
              </li>
            </Link>
            <Link to="/movie" style={{ textDecoration: "none" }}>
              <li>
                
                <span>Movies</span>
              </li>
            </Link>
           
          </ul>
        </div>
       
      </div>
    )
}

export default Sidebar