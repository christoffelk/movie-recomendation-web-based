import React from 'react'
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './create.scss'
import {useNavigate} from 'react-router-dom'
const New = ({ title }) => {
    
    const [firstName,setFirstName] = React.useState("");
    const [lastName,setLastName] = React.useState("");
    const [userName,setUserName] = React.useState("");
    const [email,setEmail] = React.useState("");
    const [suspended,setSuspended] = React.useState(false)
    const [roleId,setRoleId] = React.useState(0)
    const [BirthDate,setBirthDate] =React.useState(new Date())
    const [gender,setGender] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [confirmPassword,setConfirmPassword] = React.useState("")
    const navigate = useNavigate();
    function postUser(){
      return fetch('http://localhost:5000/user',{
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          userName,
          email,
          suspended,
          roleId,
          BirthDate,
          gender,
          password,
          confirmPassword
        }),

      })
    }
    function handleSubmit(e){
      e.preventDefault();
      postUser()
      navigate('/users')
    }
    return (
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="top">
            <h1>{title}</h1>
          </div>
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
                    <input type='text' placeholder='Input Your Name' onChange={(e)=> setFirstName(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>lastName</label>
                    <input type='text' placeholder='Input Your Last Name'  onChange={(e)=> setLastName(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>UserName</label>
                    <input type='text' placeholder='Input Your Username'  onChange={(e)=> setUserName(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>Email</label>
                    <input type='email' placeholder='Input Your Email'  onChange={(e)=> setEmail(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>suspended</label>
                    <input type='text' placeholder='Input isSuspended' onChange={(e)=>setSuspended(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>RoleId</label>
                    <input type='number' placeholder='Input Your RoleId' onChange={(e)=>setRoleId(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>BirthDate</label>
                    <input type='date' placeholder='Input Your Birth Date' onChange={(e)=>setBirthDate(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>Gender</label>
                    <input type='text' placeholder='Input Your Gender' onChange={(e)=>setGender(e.target.value)} required/>
                  </div>
                  <div className="formInput">
                    <label>Password</label>
                    <input type='password' placeholder='Input Your Password' onChange={(e)=>setPassword(e.target.value)} required minLength={8}/>
                  </div>
                  <div className="formInput">
                    <label>Confirm Password</label>
                    <input type='password' placeholder='Input Your Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)} required minLength={8}/>
                  </div>
                <button type='submit'>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default New