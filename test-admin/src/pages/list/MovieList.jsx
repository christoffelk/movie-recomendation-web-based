import React from 'react'
import Datatable from '../../components/datatable/Datatable'
import MovieTable from '../../components/datatable/MovieTable'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import './list.scss'

const MovieList = ()=> {
    return(
        <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <MovieTable/>
      </div>
    </div>
    )
}

export default MovieList