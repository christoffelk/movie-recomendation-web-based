import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import './home.scss'
const Home = ()=> {
    return(
        <div className='home'>
            <Sidebar/>
            <div className="homeContainer">
            <Navbar />
            <h1>Welcome to Admin DashBoard</h1>
        {/* <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
        </div>
    )
}

export default Home