import './App.css';
import { useState } from "react";
import Dashboard from './Dashboard';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from "react-router-dom";

function App() {
  // to navigate to desired pages useNavigate is used
  const navigate = useNavigate();
  //using usestate to initilazie and set variable states
  const [user_name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // when login button is clicked the below function executes
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers : {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          user_name: user_name,
          password: password,
        }),
      });

      const resJson = await res.json();
      // setting the access token to the local storage
      localStorage.setItem("jwt-token", resJson.access_token); 


      console.log(resJson.access_token)
      console.log(resJson)
      if (res.status === 200) {
        navigate("/Dashboard")
      } else if (res.status === 500){
        navigate("/App")
        setMessage("Invalid Credentials!!");
      }
      else if (res.status === 401){
        navigate("/App")
        setMessage("Authentication Required");
      }
      else {
        navigate("/App")
        setMessage("Incorrect Username or Password");
      }
    } catch (err) {
      console.log(err);
      setMessage("Invalid Credentials!!");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
      <h1>Employee's LogIn</h1>
      {/* <h2>Login</h2> */}
      <label htmlFor="user_name">UserName</label>
        <input
          type="user_name"
          pattern="[a-zA-Z0-9]+"
          value={user_name}
          placeholder="User Name"
          minLength={5}
          onChange={(e) => setName(e.target.value)}
        />
      <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          placeholder="Password"
          minLength={4}
          maxLength={20}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button button10" type="submit">Submit</button>
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}


export default App;
