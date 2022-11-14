import React from 'react'
import Datatable from '../../components/datatable/Datatable'
import RatingTable from '../../components/datatable/RatingTable'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import './list.scss'

const RatingList = ()=> {
    return(
        <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <RatingTable/>
      </div>
    </div>
    )
}

export default RatingList
