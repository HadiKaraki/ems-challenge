import '../../css/Table.css'
import '../../css/AllEmployees.css'
import { useState } from "react"
import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")

  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();
  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');

  const filteredEmployees = employees.filter((employee: any) => {
    const matchesId = employee.id.toString().includes(employeeIdFilter);
    const matchesName = employee.full_name.toLowerCase().includes(employeeNameFilter.toLowerCase());
    return matchesId && matchesName;
  });

  return (
    <>
    {employees.length !== 0 ? (
    <div className='all-employees-container'>
      <h3 style={{textAlign: 'center'}}>All Employees</h3>
      <input type="text" className='filter' value={employeeIdFilter} placeholder='Filter By ID' onChange={(e) => setEmployeeIdFilter(e.target.value)}/>
      <input type="text" className='filter' value={employeeNameFilter} placeholder='Filter By Name' onChange={(e) => setEmployeeNameFilter(e.target.value)}/>
      <table>
        <thead>
          <tr className='headings'>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Job Title</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
        {filteredEmployees.map((employee: any) => (
          <tr className='rows' key={employee.id}>
            <td>
              <a href={`/employees/${employee.id}`}>Employee #{employee.id}</a>
            </td>
            <td>{employee.full_name}</td>
            <td>{employee.email}</td>
            <td>{employee.phone_nb}</td>
            <td>{employee.job_title}</td>
            {/* <td>
              <button
                type='button'
                onClick={() => handleDeleteEmployee(employee.id)}
              >
                Delete
              </button>
            </td> */}
          </tr>
        ))}
          </tbody>
        </table>
      </div>
       ) : (
      <div style={{ textAlign: 'center' }}>
        <h2>No employees currently</h2>
        <a href="/employees/new">New Employee</a>
      </div>
      )}
    </>
)}
