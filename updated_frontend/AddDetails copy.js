import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Dashboard from './Dashboard';


const AddDetails = () => {
    
    const navigate = useNavigate();
    const [emp_id, setID] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [emp_dob, setDob] = useState("");
    const [emp_skilllevel, setSkilllevel] = useState("");
    const [active, setActive] = useState("");
    const [emp_age, setAge] = useState("");
    const [emp_email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const token = localStorage.getItem('jwt-token');

   /*  this.state = {
      value: "coconut",
      countries: [
        { id: "1", level: "1" },
        { id: "2", level: "2" },
        { id: "3", level: "3" }
      ]
    }; */

    // function executes when Add button is clicked
    let handleAddDetails = async (e) => {
        e.preventDefault();
        try {
          let res = await fetch("http://127.0.0.1:5000/api/add", {
            method: "POST",
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
          else if (res.status === 409) {
            setMessage("User already exists!!");
          }
          else {
            
            setMessage("Some error occured");
          }
        } catch (err) {
          console.log(err);
          setMessage("Please fill the details!!");
        }
      };

      const goHome = () => {
        navigate("/Dashboard");
      };


    return(
        <div className = "form-box">
           <form onSubmit={handleAddDetails}>
                <label>Emp Id:</label>
                <input type="text" 
                  minLength={1}
                  maxLength={10}
                  value={emp_id}
                  onChange={(e) => setID(e.target.value)}/>
                <label>First name </label>
                <input type ="text"
                  pattern="[a-zA-Z0-9]+"
                  value={first_name}
                  onChange={(e) => setFirstname(e.target.value)}/>
                <label>Last name </label>
                <input type ="text"
                  pattern="[a-zA-Z0-9]+"
                  value={last_name}
                  onChange={(e) => setLastname(e.target.value)}/>
                <label>DOB </label>
                <input type ="date"
                  min="1960-12-30"
                  max= "2005-12-30"
                  value={emp_dob}
                  onChange={(e) => setDob(e.target.value)}/>
                <label>SkillLevel (Jr=1, Mid Sr=2, Sr=3) </label>
                {/* <select>
                <option value="1">Junior</option>
                <option value="2">Mid</option>
                <option value="3">Senior</option>
                </select>  */}
                <input type ="text"
                  value={emp_skilllevel}
                  onChange={(e) => setSkilllevel(e.target.value)}/>
                <label>Active (Active = 1, Not Active = 0) </label>
                <input type ="text"
                  value={active}
                  onChange={(e) => setActive(e.target.value)}/>
                <label>Age</label>
                <input type ="number"
                  value={emp_age}
                  onChange={(e) => setAge(e.target.value)}/>
                <label>Email</label>
                <input type ="email"
                  value={emp_email}
                  onChange={(e) => setEmail(e.target.value)}/>
                <button className="button button3" >Add</button>
                <button className="button button6" onClick={goHome}>Cancel</button>
            </form>
            <div className="message">{message ? <p>{message}</p> : null}</div>
        </div>
    );

};

export default AddDetails;