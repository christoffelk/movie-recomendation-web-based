import React from 'react'
import './login.css'
import {useNavigate} from 'react-router-dom'

async function loginAdmin(cred){
    return fetch('http://localhost:5000/admin/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cred)
    }).then(data => data.json())
}


const Login = ({setToken})=> {
    const [userName,setUserName] = React.useState();
    const [password,setPassword] = React.useState();

    const navigate = useNavigate()
    const onSubmit = async e => {
        e.preventDefault();
        const token = await loginAdmin({
            userName,
            password
        })
        if(token.success){
            navigate("/dashboard")
        }
        
        setToken(token.data.token)
        
        
    }
    return(
        <div className='form'>
        <form id="slick-login" onSubmit={onSubmit}>
		<input type="text" name="username" placeholder="me@tutsplus.com" onChange={e => setUserName(e.target.value)}/>
		<input type="password" name="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
		<input type="submit" value="Log In"/>
	</form>
    </div>
    )
}

export default Login
