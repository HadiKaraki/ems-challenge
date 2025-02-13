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
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [pagination, setPagination] = useState(0);
  // to show what page is currently displayed
  const [pageNb, setPageNb] = useState(1);

  const filteredEmployees = employees.filter((employee: any) => {
    const matchesId = employee.id.toString().includes(employeeIdFilter);
    const matchesName = employee.full_name.toLowerCase().includes(employeeNameFilter.toLowerCase());
    const matchesJobName = employee.job_title.toLowerCase().includes(jobTitleFilter.toLowerCase());
    return matchesId && matchesName && matchesJobName;
  });

  const handlePagination = (page: any) => {
    const rowsPerPage = 5; // Number of rows per page
  
    if (page === 'go_up') {
      // Check if there are enough rows to go to the next page
      if (pagination + rowsPerPage < employees.length) {
        setPagination((prevPage) => prevPage + rowsPerPage);
        setPageNb((prevPage) => prevPage + 1);
      }
    } else {
      // Check if we are not already on the first page
      if (pagination - rowsPerPage >= 0) {
        setPagination((prevPage) => prevPage - rowsPerPage);
        setPageNb((prevPage) => prevPage - 1);
      }
    }
  };

  return (
    <>
    {employees.length !== 0 ? (
    <div className='all-employees-container'>
      <h3 style={{textAlign: 'center'}}>All Employees</h3>
      <input type="text" className='filter' value={employeeIdFilter} placeholder='Filter By ID' onChange={(e) => setEmployeeIdFilter(e.target.value)}/>
      <input type="text" className='filter' value={employeeNameFilter} placeholder='Filter By Name' onChange={(e) => setEmployeeNameFilter(e.target.value)}/>
      <input type="text" className='filter' value={jobTitleFilter} placeholder='Filter By Job' onChange={(e) => setJobTitleFilter(e.target.value)}/>
      {employees.length > 5 &&
        <div>
          <label style={{marginRight: '10px'}}>Pages</label>
            <button type='button' onClick={() => handlePagination('go_back')}>-</button>
            <span style={{margin: '0 10px'}}>{pageNb}</span>
            <button type='button' onClick={() => handlePagination('go_up')}>+</button>
        </div>
      }
      <table>
        <thead>
          <tr className='headings'>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Job Title</th>
          </tr>
        </thead>
        <tbody>
        {filteredEmployees.slice(pagination, pagination + 5).map((employee: any) => (
          <tr className='rows' key={employee.id}>
            <td>
              <a style={{color: 'black'}} href={`/employees/${employee.id}`}>Employee #{employee.id}</a>
            </td>
            <td>{employee.full_name}</td>
            <td>{employee.email}</td>
            <td>{employee.phone_nb}</td>
            <td>{employee.job_title}</td>
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
