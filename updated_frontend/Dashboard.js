import React, { useEffect, useState } from "react"
import AddDetails from './AddDetails';
import LoadingSpinner from "./LoadingSpinner";
import './LoadingSpinner.css';
import UpdateDetails from "./UpdateDetails";
import { Link, useNavigate } from "react-router-dom";
import { format } from 'date-fns';

const Dashboard = () => {
    // to navigate to desired pages useNavigate is used
    const navigate = useNavigate();
    //using usestate to initilazie and set variable states
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("")
    // Getting the access token from the local storage
    const token = localStorage.getItem('jwt-token');
    const [skills, setSkills] = useState([]);
    if (token==null)
    {
        navigate("/App")
    }
    // function to fectch the employee details to be displayed in the dashboard after login
    let FetchData  = async (e) => {
        try {
            let res = await fetch("http://127.0.0.1:5000/api/users", {
                method: "GET",
                headers : {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token //authorization token
                },
            });
            let data = await res.json();
            setUsers(data)

        if (res.status === 200) {
            console.log("success");
            
        } else if (res.status === 401) {
            setMessage("Authentication Required");
        }
        else {
            
            setMessage("Some error occured");
        }
        } catch (err) {
        console.log(err);
        setMessage("Some error occured!!");
        } 
    };

    useEffect(() => {
        FetchData();
    }, []);

    // function to delete the employee on delete button click
    const deleteData = async (emp_id) =>
    {
        if (window.confirm('Are you sure you want to delete  "' + emp_id + '"  employee?')) {
            try {
                // send the request to the backend for deleting the employee.
                let result =await fetch ("http://127.0.0.1:5000/api/delete/"+emp_id,{
                method:'DELETE',
                headers : {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token //authorization token
                },
                
        });
        let data = await result.json();
        if (result.status === 200) {
            FetchData();  
        }
        console.warn(data);
        } catch (err) {
            console.log(err);
            setMessage("Unable to fetch user list");
        }

       } else {
            //setMessage('operation cancelled');
            console.log('operation cancelled');
        }
    
    }

    const handleCreate =  (e) => {
        e.preventDefault();
        navigate("/AddDetails")
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

    // on logout button click
    const logout = () => {
        localStorage.removeItem('jwt-token') // the token is removed on logout click
        navigate("/App");
      };

      // on Update button click
      const LoadEdit = (emp) => {
        navigate(`/Dashboard/UpdateDetails/${emp}`,{emp});
        console.log(emp);
    }

    return(
        <div>
            <div><h1>Manage Employees</h1> </div>
            <button className="button button2" onClick={handleCreate}>Add New</button>
            <button className="button button7" onClick={logout}>Logout</button>
             
            <div>
            <table className="center" cellSpacing="0">
             <thead> 
                    <tr>
                        <th>EmployeeID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>DOB</th>
                        <th>Skill Level</th>
                        <th>Active</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Update/Delete Details</th>
                    </tr>
             </thead> 
            <tbody>
                {users.length > 0 && users.map(user => (
                    <tr key= {user.emp_id}> 
                        <th scope="row" >{user.emp_id}</th>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.emp_dob}</td>
                        <td>{user.skill_level}</td>

                        {/* {user.emp_skilllevel== "1" ?(<td>{"Junior"}</td>):
                        (user.emp_skilllevel== "2" ?(<td>{"Midsenior"}</td>):
                        (user.emp_skilllevel== "3" ?(<td>{"Senior"}</td>):
                        <td>{"Undefined"}</td>))} */}

                        {user.active== "1" ?(<td>{"Yes"}</td>):
                        (user.active== "0" ?(<td>{"No"}</td>):
                        <td>{"Undefined"}</td>)}   
                        
                        <td>{user.emp_age}</td>
                        <td>{user.emp_email}</td>
                        <td>
                            
                            <button  className="button button1"  onClick={() => { LoadEdit(user.emp_id) }} >Update</button>
                            <button  className="button button9" onClick={() => deleteData(user.emp_id)}>Delete</button></td>
                    </tr>
                ))}
        </tbody>
        </table>
        </div>
        <div className="message">{message ? <p>{message}</p> : null}</div>
        </div>
        
    )

  };
  export default Dashboard;