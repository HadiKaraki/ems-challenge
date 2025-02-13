import '../../css/FormStyling.css'
import { useLoaderData, useParams, type LoaderFunctionArgs } from "react-router";
import { useState } from 'react';
import { getDB } from "~/db/getDB";
import { Form, redirect, type ActionFunction } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { timesheetId } = params;
  const db = await getDB();
  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", timesheetId);

  // get employees to update the timesheet if needed
  const employees = await db.all("SELECT * FROM employees;")
  
  return { timesheet, employees }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary_work = formData.get("summary_work");
  const timesheet_id = formData.get("timesheet_id");

  const db = await getDB();

  await db.run(
    `UPDATE timesheets SET start_time = ?, end_time = ?, summary_work = ? WHERE id = ?`,
    [start_time, end_time, summary_work, timesheet_id]
  );

  return redirect("/timesheets");
}

export default function TimesheetPage() {
  const { employees } = useLoaderData();
  const { timesheet } = useLoaderData();
  const { timesheetId } = useParams();
  const [startDate, setStartDate] = useState(timesheet.start_time);
  const [endDate, setEndDate] = useState(timesheet.end_time);
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
      <h2 style={{textAlign: 'center'}}>Timesheet #{timesheetId}</h2>
      <Form method="post" className='data-form' onSubmit={handleSubmit}>
        <div>
          <h2>Update Timesheet</h2>
          <div className="row">
            <div className="col">
              <label>Select Employee</label>
              <select value={timesheet.employee_id} name="employee_id" id="employee_id" required>
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
            <textarea style={{width: '100%'}} defaultValue={timesheet.summary_work} name="summary_work" id="summary_work" required />
          </div>
        </div>
        <input value={timesheet.id} name="timesheet_id" style={{display: 'none'}}></input>
        <button type="submit">Update Timesheet</button>
      </Form>
    </div>
  )
}
