import '../../css/FormStyling.css'
import { useState } from 'react';
import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

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

  // Server side validation
  if (
    !full_name || !email || !phone_nb || !date_of_birth || 
    !job_title || !department || !salary || !start_date
  ) {
    return { error: "Empty required field" };
  }

  const db = await getDB();
  await db.run(
    `INSERT INTO employees 
      (full_name, email, phone_nb, date_of_birth, job_title, department, salary, start_date, end_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_nb, date_of_birth, job_title, department, salary, start_date, end_date]
  );

  return redirect("/employees");
}

export default function NewEmployeePage() {
  const [email, setEmail] = useState("");
  const [phoneNb, setPhoneNb] = useState("");
  const [salary, setSalary] = useState("");
  const [dob, setDob] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [errors, setErrors] = useState({
      email: "",
      phoneNb: "",
      minSalary: "",
      timeError: "",
      greaterThan18: ""
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors = { email: "", phoneNb: "", minSalary: "", timeError: "", greaterThan18: "" };
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

    // min wage should be $900
    if (parseInt(salary) < 900) {
      newErrors.minSalary = "Salary much be atleast $900.";
      isValid = false;
    }

    // date of birth should be atleast 18
    const dateOfBirth = new Date(dob);
    const yearOfBirth = dateOfBirth.getFullYear();
    const monthOfBirth = dateOfBirth.getMonth();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if(currentYear - yearOfBirth >= 18) {
      if(currentMonth - monthOfBirth < 0) {
        newErrors.greaterThan18 = "Must be atleast 18 years old.";
        isValid = false;
      }
    }

    // verify that end date is after start date
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    if (endTime < startTime) {
        newErrors.timeError = "End time is before start time!";
        isValid = false;
    } else if (endTime === startTime){
        newErrors.timeError = "End time is the same as start time!";
        isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;
    e.currentTarget.submit();
  };

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Create New Employee</h2>
      <Form method="post" className='data-form' onSubmit={handleSubmit}>
        <div className="row">
          <h2>Personal Info</h2>
        </div>
        <div className='row'>
          <div className="col">
            <label htmlFor="full_name">Full Name</label>
            <input type="text" name="full_name" id="full_name" required />
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
            <input type="date" onChange={(e) => setDob(e.target.value)} value={dob} name="date_of_birth" id="date_of_birth" required/>
            {errors.greaterThan18 && <p style={{ color: "red" }}>{errors.greaterThan18}</p>}
          </div>
        </div>
        <div className="row">
          <h2>Professional Info</h2>
        </div>
        <div className='row'>
          <div className="col">
            <label htmlFor="job_title">Job Title</label>
            <input type="text" name="job_title" id="job_title" required />
          </div>
          <div className="col">
            <label htmlFor="department">Department</label>
            <input type="text" name="department" id="department" required />
          </div>
          <div className="col">
            <label htmlFor="salary">Salary</label>
            <input type="text" name="salary" id="salary" onChange={(e) => setSalary(e.target.value)} required />
            {errors.minSalary && <p style={{ color: "red" }}>{errors.minSalary}</p>}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label htmlFor='start_date'>Start date</label>
            <input type='date' onChange={(e) => setStartDate(e.target.value)} value={startDate} name='start_date' id='start_date'></input>
          </div>
          <div className="col">
            <label htmlFor="end_date">End date</label>
            <input type='date' onChange={(e) => setEndDate(e.target.value)} value={endDate} name='end_date' id='end_date'></input>
            {errors.timeError && <p style={{ color: "red" }}>{errors.timeError}</p>}
          </div>
        </div>
        <div className="row">
          <button type="submit">Create Employee</button>
        </div>
      </Form>
    </div>
  );
}
