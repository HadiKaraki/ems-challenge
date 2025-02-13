import '../../css/FormStyling.css'
import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";

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
  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Create New Timesheet</h2>
      <Form className="new-data-form" method="post">
        <div>
          <label style={{marginRight: '20px'}}>Select Employee</label>
          <select name="employee_id" id="employee_id" required>
            <option value="">Select an Employee</option>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className='row'>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" name="start_time" id="start_time" required />
        </div>
        <div className='row'>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" name="end_time" id="end_time" required />
        </div>
        <div className='row'>
          <label htmlFor="summary_work">Summary Work</label>
          <textarea style={{width: '100%'}} name="summary_work" id="summary_work" required />
        </div>
        <button type="submit">Create Timesheet</button>
      </Form>
    </div>
  );
}
