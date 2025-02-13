import '../../css/UpdateEmployee.css'
import { useLoaderData, useParams, type LoaderFunctionArgs } from "react-router";
import { useState } from 'react';
import { getDB } from "~/db/getDB";
import { Form, redirect, type ActionFunction } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { employeeId } = params;
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", employeeId);

  return { employee };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_nb = formData.get("phone_nb");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const employeeId = formData.get('employee_id');

  // Server side validation
  if (
    !full_name || !email || !phone_nb || !date_of_birth || 
    !job_title || !department || !salary || !start_date
  ) {
    return { error: "Empty required field" };
  }

  const db = await getDB();
  await db.run(
    `UPDATE employees
     SET 
       full_name = ?,
       email = ?,
       phone_nb = ?,
       date_of_birth = ?,
       job_title = ?,
       department = ?,
       salary = ?,
       start_date = ?,
       end_date = ?
     WHERE id = ?`,
    [full_name, email, phone_nb, date_of_birth, job_title, department, salary, start_date, end_date, employeeId]
  );

  return redirect("/employees");
}

export default function EmployeePage() {
  const { employee } = useLoaderData();
  const { employeeId } = useParams();
  const [email, setEmail] = useState(employee.email);
  const [phoneNb, setPhoneNb] = useState(employee.phone_nb);
    
  const [errors, setErrors] = useState({
    // fullName: "",
    email: "",
    phoneNb: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors = { fullName: "", email: "", phoneNb: "" };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phoneNb)) {
      newErrors.phoneNb = "Phone number must be exactly 8 digits.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    e.currentTarget.submit();
  };

  return (
    <div>
      <div>
        <h2 style={{textAlign: 'center'}}>Employee #{employeeId}</h2>
        {employee ? (
          <Form method="post" className='new-employee-form' onSubmit={handleSubmit}>
            <div className="row">
              <h2>Personal Info</h2>
            </div>
            <div className='row'>
              <div className="col">
                <label htmlFor="full_name">Full Name</label>
                <input type="text" name="full_name" defaultValue={employee.full_name} id="full_name" required />
              </div>
              <div className="col">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" required onChange={(e) => setEmail(e.target.value)} value={email}/>
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
              </div>
            </div>
            <div className='row'>
              <div className="col">
                <label htmlFor="phone_nb">Phone Number</label>
                <input type="text" name="phone_nb" id="phone_nb" required onChange={(e) => setPhoneNb(e.target.value)} value={phoneNb}/>
                {errors.phoneNb && <p style={{ color: "red" }}>{errors.phoneNb}</p>}
              </div>
              <div className="col">
                <label htmlFor="date_of_birth">Date of birth</label>
                <input type='date' name='date_of_birth' defaultValue={employee.date_of_birth} id='date_of_birth'></input>
              </div>
            </div>
            <div className="row">
              <h2>Professional Info</h2>
            </div>
            <div className='row'>
              <div className="col">
                <label htmlFor="job_title">Job Title</label>
                <input type="text" name="job_title" defaultValue={employee.job_title} id="job_title" required />
              </div>
              <div className="col">
                <label htmlFor="department">Department</label>
                <input type="text" name="department" defaultValue={employee.department} id="department" required />
              </div>
              <div className="col">
                <label htmlFor="salary">Salary</label>
                <input type="text" name="salary" defaultValue={employee.salary} id="salary" required />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor='start_date'>Start date</label>
                <input type='date' name='start_date' defaultValue={employee.start_date} id='start_date'></input>
              </div>
              <div className="col">
                <label htmlFor="end_date">End date</label>
                <input type='date' name='end_date' defaultValue={employee.end_date} id='end_date'></input>
              </div>
            </div>
            <input type="number" name="employee_id" value={employeeId} style={{display: 'none'}}></input>
            <div className="row">
              <button type="submit">Update Employee</button>
            </div>
        </Form>
        ) : (
          <p>Employee not found</p>
        )}
      </div>
    </div>
  );
}