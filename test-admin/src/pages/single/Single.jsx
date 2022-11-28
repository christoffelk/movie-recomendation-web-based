import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import List from '../list/List'
import {useNavigate} from 'react-router-dom'

import './single.scss'
const Single = ()=> {
  let {UserId} = useParams()
  const navigate = useNavigate();

  const [firstName,setFirstName] = React.useState("");
    const [lastName,setLastName] = React.useState("");
    const [suspended,setSuspended] = React.useState(false)
    const [roleId,setRoleId] = React.useState(0)
    const [birthDate,setBirthDate] =React.useState(new Date())
    const [gender,setGender] = React.useState("");

  function updateUser(){
    return fetch(`http://localhost:5000/user/${UserId}`,{
      method: 'PUT',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: "Bearer" + " " + JSON.parse(sessionStorage.getItem("token")),
      },
      body: JSON.stringify({
        firstName,
        lastName,
        suspended,
        roleId,
        birthDate,
        gender
      })
    })
  }
  React.useEffect(() => {
      fetch(`http://localhost:5000/user/${UserId}`,{
        headers: {
          Authorization: "Bearer" + " " + JSON.parse(sessionStorage.getItem("token")),
        },
      })
      .then(response => response.json()).then(data =>{
        setFirstName(data.FirstName);
        setLastName(data.LastName)
        setSuspended(data.Suspended)
        setRoleId(data.RoleId);
        setBirthDate(data.BirthDate);
        setGender(data.Gender);
      })
    },[])
  function handleSubmit(e){
    e.preventDefault();
    updateUser()
    navigate('/users')
  }
     
      return (
        <div className="new">
          <Sidebar />
          <div className="newContainer">
            <Navbar />
          
            <div className="bottom">
              {/* <div className="left">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                />
              </div> */}
              <div className="right">
                <form onSubmit={(e) => handleSubmit(e)}>
                  {/* <div className="formInput">
                    <label htmlFor="file">
                      Image: 
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </div> */}
                   <div className="formInput">
                      <label>firstName</label>
                      <input type='text' placeholder='Input Your Name' value={firstName} onChange={(e)=> setFirstName(e.target.value)} required/>
                    </div>
                    <div className="formInput">
                      <label>lastName</label>
                      <input type='text' placeholder='Input Your Last Name' value={lastName}  onChange={(e)=> setLastName(e.target.value)} required/>
                    </div>
                  
                    <div className="formInput">
                      <label>suspended</label>
                      <input type='text' placeholder='Input isSuspended' value={suspended} onChange={(e)=>setSuspended(e.target.value)} required/>
                    </div>
                    <div className="formInput">
                      <label>RoleId</label>
                      <input type='number' placeholder='Input Your RoleId' value={roleId} onChange={(e)=>setRoleId(e.target.value)} required/>
                    </div>
                    <div className="formInput">
                      <label>BirthDate</label>
                      <input type='date' placeholder='Input Your Birth Date' value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} required/>
                    </div>
                    <div className="formInput">
                      <label>Gender</label>
                      <input type='text' placeholder='Input Your Gender' value={gender} onChange={(e)=>setGender(e.target.value)} required/>
                    </div>
                   
                  <button type='submit'>Send</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );    
  
}

export default Single
