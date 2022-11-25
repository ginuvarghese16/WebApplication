import React, { useEffect, useState } from "react"
import AddDetails from './AddDetails';
import EditUser from "./EditUser";
import { Link, useNavigate } from "react-router-dom";
/* import background from "./image.png"; */

const Dashboard = () => {
    // to navigate to desired pages useNavigate is used
    const navigate = useNavigate();
    //using usestate to initilazie and set variable states
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("")
    // Getting the access token from the local storage
    const token = localStorage.getItem('jwt-token');
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
        FetchData()
    }, [])

    // function to delete the employee on delete button click
    async function deleteData(emp_id)
    {
        let result = await fetch ("http://127.0.0.1:5000/api/delete/"+emp_id,{
            method:'DELETE',
            headers : {
                'Authorization':'Bearer '+token //authorization token
                },
        });
        result = await result.json();
        console.warn(result);
        FetchData(); // loading the details again
    }

    const handleCreate =  (e) => {
        e.preventDefault();
        navigate("/AddDetails")
    };

    // to set the fields in the local storage for using it for edit purpose
    const setData = (emp_id, first_name, last_name, emp_dob, emp_skilllevel, active, emp_age, emp_email) => {

        localStorage.setItem('emp_id', emp_id)
        localStorage.setItem('first_name', first_name)
        localStorage.setItem('last_name', last_name)
        localStorage.setItem('emp_dob', emp_dob)
        localStorage.setItem('emp_skilllevel', emp_skilllevel)
        localStorage.setItem('active', active)
        localStorage.setItem('emp_age', emp_age)
        localStorage.setItem('emp_email', emp_email)
              
    }
    // on logout button click
    const logout = () => {
        localStorage.removeItem('jwt-token') // the token is removed on logout click
        navigate("/App");
      };

    /*   const myStyle={
        backgroundImage: `url(${background})` ,
        height:'100vh',
        
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }; */

    return(
        <div /* style={myStyle} */>
             
            <form onSubmit={handleCreate}>
            <button className="button button2"  >Add New</button>
            <button className="button button7" onClick={logout}>Logout</button>
            </form> 
            <div><h1>Manage Employees</h1> </div>
            <div>
            <table class="center" cellSpacing="0">
                    <tr>
                        <th>EmployeeID</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>DOB</th>
                        <th>SkillLevel</th>
                        <th>Active</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Update Details</th>
                        <th>Delete Details</th>
                    </tr>

            <tbody>
                {users.length > 0 && users.map(user => (
                    <tr>
                        <td >{user.emp_id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.emp_dob}</td>
                        <td>{user.emp_skilllevel}</td>
                        <td>{user.active}</td>
                        <td>{user.emp_age}</td>
                        <td>{user.emp_email}</td>
                        <td>
                            <Link to = '/Dashboard/EditUser/${user.emp_id}'>
                            <button  className="button button1"  onClick={() => setData(user.emp_id, user.first_name, user.last_name, user.emp_dob, user.emp_skilllevel, user.active, user.emp_age, user.emp_email)}>Update</button>
                            </Link>
                        </td>
                        <td><button  className="button button9" onClick={() => deleteData(user.emp_id)}>Delete</button></td>
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