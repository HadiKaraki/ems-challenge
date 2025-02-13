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

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Timesheet #{timesheetId}</h2>
      <Form method="post">
        <div>
          <h2>Update Timesheet</h2>
          <select name="employee_id" id="employee_id" required>
            <option defaultValue={timesheet.employee_id}>Select an Employee</option>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" defaultValue={timesheet.start_time} name="start_time" id="start_time" required />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" defaultValue={timesheet.end_time} name="end_time" id="end_time" required />
        </div>
        <div>
          <label htmlFor="summary_work">Summary Work</label>
          <textarea name="summary_work" defaultValue={timesheet.summary_work} id="summary_work" required />
        </div>
        <input value={timesheet.id} name="timesheet_id" style={{display: 'none'}}></input>
        <button type="submit">Update Timesheet</button>
      </Form>
    </div>
  )
}
