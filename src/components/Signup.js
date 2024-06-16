import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'


const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword:"" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault(); // this prevents the page from reloading
      const {name , email , password } = credentials;

      const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
          method: "POST",

          headers: {
              "Content-Type": "application/json"
          },

          body: JSON.stringify({ name, email, password}), // body data type must match "Content-Type" header
      });
      const json = await response.json()
      console.log(json)
      if (json.success) {
          //        Save the authToken and redirect
          localStorage.setItem('token', json.authtoken)
          // history.push("/");
          navigate('/')
          props.showAlert("Account created Successfully" , "success");
      } else {
          props.showAlert("Invalid Credentials" , "danger");
      }

  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
}
  return (
    <div className='container mt-2'>
      <h2 className='my-2'>Sign up To continue in NoteCLOUD</h2>
      
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" onChange={onChange} id="name" name='name'  aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" onChange={onChange} id="email"  name='email'  aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
       
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" onChange={onChange} id="password"  name='password' required minLength={5}  />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" onChange={onChange} id="cpassword" name='cpassword' required minLength={5}   />
        </div>
       

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
