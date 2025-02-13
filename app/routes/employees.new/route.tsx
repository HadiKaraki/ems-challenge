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
  const [dob, setDob] = useState<string>("");
  const [above18Error, setAbove18Error] =  useState<{ above_18?: string }>({});
  
  const [errors, setErrors] = useState({
      // fullName: "",
      email: "",
      phoneNb: "",
      above_18: ""
  });

  function calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
  
    let age = today.getFullYear() - dob.getFullYear();
  
    return age;
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDob(selectedDate);

    if (calculateAge(selectedDate) < 18) {
      setAbove18Error({ above_18: "Should be at least 18 years old." });
    } else {
      setAbove18Error({});
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // let newErrors = { fullName: "", email: "", phoneNb: "" };
    let newErrors = { email: "", phoneNb: "", above_18: "" };
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

    if(calculateAge(dob)<18) {
      newErrors.above_18 = "Should be atleast 18 years old."
    }

    setErrors(newErrors);

    if (!isValid) return;

    e.currentTarget.submit();
  };

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Create New Employee</h2>
      <Form method="post" className='new-data-form' onSubmit={handleSubmit}>
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
            <input
              type="date"
              name="date_of_birth"
              onChange={handleDateChange}
              id="date_of_birth"
              value={dob}
            />
            {above18Error.above_18 && <p style={{ color: "red" }}>{above18Error.above_18}</p>}
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
            <input type="text" name="salary" id="salary" required />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label htmlFor='start_date'>Start date</label>
            <input type='date' name='start_date' id='start_date'></input>
          </div>
          <div className="col">
            <label htmlFor="end_date">End date</label>
            <input type='date' name='end_date' id='end_date'></input>
          </div>
        </div>
        <div className="row">
          <button type="submit">Create Employee</button>
        </div>
      </Form>
    </div>
  );
}
