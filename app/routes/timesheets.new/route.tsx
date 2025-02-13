import '../../css/FormStyling.css'
import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";
import { useState } from 'react';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary_work = formData.get("summary_work");

  const db = await getDB();

  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, summary_work) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time, summary_work]
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeError, setTimeError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;

    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    if (endTime < startTime) {
        setTimeError("End time is before start time!");
        isValid = false;
    } else if (endTime === startTime){
        setTimeError("End time is the same as start time!");
        isValid = false;
    }

    if (!isValid) return;
    e.currentTarget.submit();
  };

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Create New Timesheet</h2>
      <Form className='data-form' method="post" onSubmit={handleSubmit}>
        <div>
          <div className="row">
            <div className="col">
              <label>Select Employee</label>
              <select name="employee_id" id="employee_id" required>
                {employees.map((employee: any) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className="col" style={{width: '100%'}}>
            <label htmlFor="start_time">Start Time</label>
            <input type="datetime-local" onChange={(e) => setStartDate(e.target.value)} value={startDate} name="start_time" id="start_time" required />
          </div>
        </div>
        <div className='row'>
          <div className="col" style={{width: '100%'}}>
            <label htmlFor="end_time">End Time</label>
            <input type="datetime-local" onChange={(e) => setEndDate(e.target.value)} value={endDate} name="end_time" id="end_time" required />
            {timeError && <p style={{ color: "red" }}>{timeError}</p>}
          </div>
        </div>
        <div className='row'>
          <div className="col" style={{width: '100%'}}>
            <label htmlFor="summary_work">Summary Work</label>
            <textarea style={{width: '100%'}} name="summary_work" id="summary_work" required />
          </div>
        </div>
        <button type="submit">Create Timesheet</button>
      </Form>
    </div>
  );
}
