import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Dashboard from './Dashboard';
import LoadingSpinner from "./LoadingSpinner";


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
    const [skills, setSkills] = useState([]);
    const token = localStorage.getItem('jwt-token');
    
    var activeId =" ";

    useEffect(()=>{
      if (token==null)
    {
        navigate("/App")
    }
      },[]);

    // function executes when Add button is clicked
    let handleAddDetails = async (e) => {
        e.preventDefault();

        
        if(active == "1")
        {
          activeId = "1"
        }
        if(active == "0")
        {
          activeId = "0"
        }

        if(emp_id.length==0)
        {
            alert("All Fields are Required. Please fill the fields!!")
            return;
        }

          if(first_name.trim().length===0 )
          {
              alert("All Fields are Required. Please fill the fields!!")
              return;
          }

          if(last_name.trim().length===0 )
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(emp_dob.length==0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(emp_skilllevel.length==0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(emp_age===" " | emp_age.length===0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(emp_email.trim().length===0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(active.length==0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }


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
                active:activeId,
                emp_age:emp_age,
                emp_email:emp_email,
            }),
          });
          let resJson = await res.json();
          if (res.status === 200) {
            alert('User  "' + emp_id + '"  added successfully.')
            navigate("/Dashboard")
          } else if (res.status === 401) {
            setMessage("Authentication Required");
          }
          else if (res.status === 409) {
            alert('User  "' + emp_id + '"  already exists!!')
            //setMessage("User already exists!!");
          }
          else {
            setMessage("Some error occured");
          }
        } catch (err) {
          setMessage("Please fill the details!!");
        }
      };

      const goHome = () => {
        navigate("/Dashboard");
      };

      useEffect(() =>{
        const GetSkills  = async () => {
        
              let res = await fetch("http://127.0.0.1:5000/api/skills", {
                  method: "GET",
                  headers : {
                  'Content-Type':'application/json',
                  'Authorization':'Bearer '+token //authorization token
                  },
              });

            let data = await res.json();
              
            await setSkills(data);
          
      };
      GetSkills();
      },[])



    return(
        <div className = "form-box">
         
         <h3>Add New Employee</h3>
           <form onSubmit={handleAddDetails}>
                <label>Emp Id</label>
                <span style={{ color: 'red' }}> *</span>
                <input type="text" 
                  minLength={1}
                  maxLength={10}
                  value={emp_id}
                  onChange={(e) => setID(e.target.value)}/>
                <label>First Name </label>
                <span style={{ color: 'red' }}> *</span>
                <input type ="text"
                  pattern="[a-zA-Z0-9]+"
                  value={first_name}
                  onChange={(e) => setFirstname(e.target.value)}/>
                <label>Last Name </label>
                <span style={{ color: 'red' }}> *</span>
                <input type ="text"
                  pattern="[a-zA-Z0-9]+"
                  value={last_name}
                  onChange={(e) => setLastname(e.target.value)}/>
                <label>DOB </label>
                <span style={{ color: 'red' }}> *</span>
                <input type ="date"
                  min="1960-12-30"
                  max= "2005-12-30"
                  value={emp_dob}
                  onChange={(e) => setDob(e.target.value)}/>
                  
                <label>Skill Level </label>
                <span style={{ color: 'red' }}> *</span>
                <select onChange={(e) => setSkilllevel(e.target.value)} defaultValue= {'DEFAULT'} >
                  <option value ="DEFAULT" disabled hidden >Select Skill Level</option>
                  {skills.map(skillname => (
                    <option value ={(skillname.skill_id)} key ={skillname.skill_level}>{skillname.skill_level}</option>
                  ))}
                </select>
                <label>Active </label>
                <span style={{ color: 'red' }}> *</span>
                <select onChange={(e) => setActive(e.target.value)} defaultValue= {'DEFAULT'} id = "id" >
                  <option value ="DEFAULT" disabled hidden >Select Active Status</option>
                  <option value = "1" >Yes</option>
                  <option value = "0" >No</option>
                </select>

                <label>Age</label>
                <span style={{ color: 'red' }}> *</span>
                <input type ="number"
                  min="18"
                  max="60"
                  value={emp_age}
                  onChange={(e) => setAge(e.target.value)}/>
                <label>Email</label>
                <span style={{ color: 'red' }}> *</span>
                <input type ="email"
                  value={emp_email}
                  onChange={(e) => setEmail(e.target.value)}/>
                <button className="button button3" >Add</button>
                <button className="button button6" onClick={goHome}>Cancel</button>
            </form>
            <div>
            <span style={{ color: 'red' }}>*</span>
            <span style={{ color: 'black' }}>Required Field</span>
            </div>
            <div className="message">{message ? <p>{message}</p> : null}</div>
        </div>
    );

};

export default AddDetails;