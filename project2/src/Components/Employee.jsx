import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
//import { useNavigate } from 'react-router-dom';


const Employee = () => {

  const [employee, setEmployee] = useState([])
  //const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5000/auth/employee')
      .then(result => {
        if (result.data.Status) {
          console.log(result.data.Result)
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
  }, []);


  const handleDelete = (eid) => {
    axios.delete('http://localhost:5000/auth/delete_employee/' + eid)
      .then(result => {
        if (result.data.Status) {
          // navigate('/dahsboard/employee')
          window.location.reload()
        } else {
          alert(result.data.Error)
        }
      })
    } 

    return (
      <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'>
          <h3>Employee List</h3>
        </div>
        <Link to="/dashboard/add_employee" className="btn btn-success">Add Employee</Link>
        <div className='mt-3'>
          <table className='table'>
            <thead>
              <tr>
                <th>Eid</th>
                <th>Name</th>
                <th>Image</th>
                <th>Email</th>
                <th>Address</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                employee.map((e) =>  (
                  <tr>
                    <td>{e.eid}</td>
                    <td>{e.name}</td>
                    <td>
                      <img src={`http://localhost:5000/images/` + e.image} className="employee_image" alt=''/>
                    </td>
                    <td>{e.email}</td>
                    <td>{e.address}</td>
                    <td>{e.salary}</td>
                    <td>
                      <Link to={`/dashboard/edit_employee/` + e.eid} className='btn btn-info btn-sm me-2'>Edit</Link>
                      <button className='btn btn-warning btn-sm' onClick={() => handleDelete(e.eid)}>Delete</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>
    )
  }
export default Employee
