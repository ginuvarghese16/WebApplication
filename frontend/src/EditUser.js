import React, { useState, useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Dashboard from './Dashboard';

const EditUser = () => {
    const navigate = useNavigate();
    //const { state } = useLocation();
    const [message, setMessage] = useState("");
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [emp_dob, setDob] = useState('');
    const [emp_skilllevel, setSkill] = useState('');
    const [active, setActive] = useState('');
    const [emp_age, setAge] = useState('');
    const [emp_email, setEmail] = useState('');
    const [emp_id, setID] = useState(null);
    const token = localStorage.getItem('jwt-token');
    // Function to handle the confirm button after editing user details
    const sendDataToAPI = async (e) => {
        e.preventDefault();
        try {
          let res = await fetch("http://127.0.0.1:5000/api/update/"+emp_id, {
            method: "PUT",
            headers : {
              'Content-Type':'application/json',
              'Authorization':'Bearer '+token //authorization token
            },
            body: JSON.stringify({
                emp_id:emp_id,
                first_name:first_name,
                last_name:last_name,
                emp_dob:emp_dob,
                emp_skilllevel:emp_skilllevel,
                active:active,
                emp_age:emp_age,
                emp_email:emp_email,
            }),
          });
          let resJson = await res.json();
          if (res.status === 200) {
            navigate("/Dashboard")
          } else if (res.status === 401) {
            setMessage("Authentication Required");
          }
          else {
            
            setMessage("Some error occured");
          }
        } catch (err) {
          console.log(err);
          setMessage("Please fill the details!!");
        }
    };

    // Filling the details fromthe local storage
    useEffect(() => {
        setFirstName(localStorage.getItem('first_name'));
        setLastName(localStorage.getItem('last_name'));
        setDob(localStorage.getItem('emp_dob'));
        setSkill(localStorage.getItem('emp_skilllevel'));
        setActive(localStorage.getItem('active'));
        setAge(localStorage.getItem('emp_age'));
        setEmail(localStorage.getItem('emp_email'));
        setID(localStorage.getItem('emp_id'))
    }, [])

    const goHome = () => {
        navigate("/Dashboard");
      };

return(
    <div className = "form-box">
       <form>
        <label>FirstName </label>
            <input type ="text"
             name="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
            <label>Lastame </label>
            <input type ="text"
             name="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)}/>
            <label>DOB </label>
            <input type ="date"
            name="emp_dob" value={emp_dob} onChange={(e) => setDob(e.target.value)}/>
            <label>SkillLevel </label>
            <input type ="text"
            name="emp_skilllevel" value={emp_skilllevel} onChange={(e) => setSkill(e.target.value)}/>
            <label>Active </label>
            <input type ="text"
            name="active" value={active} onChange={(e) => setActive(e.target.value)}/>
            <label>Age</label>
            <input type ="number"
            name="emp_age" value={emp_age} onChange={(e) => setAge(e.target.value)}/>
            <label>Email</label>
            <input type ="text"
            name="emp_email" value={emp_email} onChange={(e) => setEmail(e.target.value)}/>
        </form>
        <button className="button button4" /* type='button' */ onClick={sendDataToAPI}>Confirm</button>
        <button className="button button5" /* type='button' */  onClick={goHome}>Cancel</button>
        {<div className="message">{message ? <p>{message}</p> : null}</div>}
    </div>

);
};

export default EditUser;