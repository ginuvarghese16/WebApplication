import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import LoadingSpinner from "./LoadingSpinner";
import './LoadingSpinner.css';



const UpdateDetails = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('jwt-token');

  useEffect(()=>{
    if (token==null)
    {
      navigate("/App")
    }
  },[]);
  
    const { emp_id } = useParams();
    var activeId =" ";
    console.log(emp_id);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/user/${emp_id}`, {
            method: "GET",
                headers : {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token //authorization token
                },     

        }).then((res) => {
            return res.json();
            
        }).then((resp) => {
            setID(resp.empid);
            setFirstName(resp.first_name);
            setLastName(resp.last_name);
            setDob(resp.emp_dob);
            setSkill(resp.emp_skilllevel);
            setActive(resp.active);
            setAge(resp.emp_age);
            setEmail(resp.emp_email);
        }).catch((err) => {
            console.log(err.message);
        })
    }, []);

     
      const [message, setMessage] = useState("");
      const [first_name, setFirstName] = useState('');
      const [last_name, setLastName] = useState('');
      const [emp_dob, setDob] = useState('');
      const [emp_skilllevel, setSkill] = useState('');
      const [active, setActive] = useState('');
      const [emp_age, setAge] = useState('');
      const [emp_email, setEmail] = useState('');
      const [empid, setID] = useState(null);
      const [skills, setSkills] = useState([]);
      const end = new Date('2005-12-30');
      const start = new Date('1960-12-30');
      
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



    const handlesubmit=(e)=>{
          e.preventDefault();

          if(active === "1")
          {
            activeId = "1"
          }
          if(active === "0")
          {
            activeId = "0"
          }

          /* if(first_name.length===0)
          {
              alert("All Fields are Required. Please fill the fields!!")
              return;
          } */

          if(first_name.trim().length===0 )
          {
              alert("All Fields are Required. Please fill the fields!!")
              return;
          }

          if(last_name.trim().length===0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(emp_dob.length===0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if (emp_dob > start && emp_dob < end) {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

          if(emp_skilllevel.length===0)
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

          if(active.length===0)
          {
            alert("All Fields are Required. Please fill the fields!!")
            return;
          }

            const empdata={empid,first_name,last_name,emp_dob,emp_skilllevel,active,emp_age,emp_email};
      

            let res =  fetch("http://127.0.0.1:5000/api/update/"+emp_id,{
                method:"PUT",
                headers:{"content-type":"application/json",
                'Authorization':'Bearer '+token //authorization toke
            },
            body:JSON.stringify(empdata)
            }).then((res)=>{
                if (res.status === 200) {
                    alert('User  "' + first_name + '"  updated successfully.')
                    navigate("/Dashboard")
                } else if (res.status === 401) {
                    setMessage("Authentication Required");
                }
            }).catch((err)=>{
                console.log(err.message)
            })

    }

    return(
        <div className = "form-box">
          <h3>Update Employee</h3>
          <form>
            <label>First Name </label>
            <span style={{ color: 'red' }}> *</span>
              <input type ="text"
                pattern="[a-zA-Z0-9]+"
                name="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
            <label>Last Name </label>
            <span style={{ color: 'red' }}> *</span>
              <input type ="text"
                pattern="[a-zA-Z0-9]+"
                name="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)}/>
            <label>DOB </label>
            <span style={{ color: 'red' }}> *</span>
              <input type ="date"
                min="1960-12-30"
                max= "2005-12-30"
                name="emp_dob" value={String(emp_dob)} onChange={(e) => setDob(e.target.value)}/>
            <label>Skill Level </label>
            <span style={{ color: 'red' }}> *</span>
                <select onChange={(e) => setSkill(e.target.value)} value= {emp_skilllevel} >
                  
                  {skills.map(skillname => (
                    <option value ={(skillname.skill_id)} key ={skillname.skill_level}>{skillname.skill_level}</option>
                  ))}
                </select>

              <label>Active </label>
              <span style={{ color: 'red' }}> *</span>
                  <select onChange={(e) => setActive(e.target.value)} value= {active} id = "id" >
                    <option value = "1" >Yes</option>
                    <option value = "0" >No</option>
                  </select>

              <label>Age</label>
              <span style={{ color: 'red' }}> *</span>
                < input type ="number"
                    min="18"
                    max="60"
                    name="emp_age" value={emp_age} onChange={(e) => setAge(e.target.value)}/>
              <label>Email</label>
              <span style={{ color: 'red' }}> *</span>
                <input type ="email"
                    name="emp_email" value={emp_email} onChange={(e) => setEmail(e.target.value)} required/>
          </form>
          <button type='submit' className="button button4"  onClick={handlesubmit}>Confirm</button>
          <button className="button button5"  onClick={goHome}>Cancel</button>
         
          {<div className="message">{message ? <p>{message}</p> : null}</div>}
          <div>
            <span style={{ color: 'red' }}>*</span>
            <span style={{ color: 'black' }}>Required Field</span>
          </div>
      </div>

      );
      };

export default UpdateDetails

