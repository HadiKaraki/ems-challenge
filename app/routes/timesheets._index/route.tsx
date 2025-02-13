import "../../css/Table.css"
import "../../css/AllTimesheets.css"
import { useLoaderData } from "react-router";
import { useState, useEffect, useContext } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [viewCalendar, setViewCalender] = useState(false);
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');

  const timeseetsEvents = timesheetsAndEmployees.map((timesheet: any) => {
  const start = new Date(timesheet.start_time).toISOString().slice(0, 16).replace('T', ' ');
  const end = new Date(timesheet.end_time).toISOString().slice(0, 16).replace('T', ' ');

  return {
      id: timesheet.id.toString(),
      title: `Work by ${timesheet.full_name}: ${timesheet.summary_work}`,
      start,
      end,
    };
  });

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: timeseetsEvents,
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll()
  }, [])

  const handleTest = async(id: any) => {
    // const db = await getDB();
    // await db.run("DELETE FROM timesheets WHERE id = ?", id);
  }

  const filteredTimesheets = timesheetsAndEmployees.filter((timesheet: any) => {
    const matchesId = timesheet.employee_id.toString().includes(employeeIdFilter);
    return matchesId;
  });

  return (
    <>
      {timesheetsAndEmployees.length !== 0 ? (
      <div>
        <div className="toggle-btns" style={{textAlign: 'center'}}>
          <button onClick={() => setViewCalender(false)}>Table View</button>
          <button onClick={() => setViewCalender(true)}>Calendar View</button>
        </div>
        {!viewCalendar ? (
          <div className="all-timesheets-container">
            <h3 style={{textAlign: 'center'}}>All Timesheets</h3>
            <input className="filter" type="text" placeholder="Filter by employee ID" value={employeeIdFilter} onChange={(e) => setEmployeeIdFilter(e.target.value)} />
            <table>
              <tr className="headings">
                <th>ID</th>
                <th>Employee</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Work Summary</th>
                <th>Delete</th>
              </tr>
              {filteredTimesheets.map((timesheet: any) => (
                <tr key={timesheet.id} className="rows">
                  <td><a style={{color: 'black'}} href={`/timesheets/${timesheet.id}`}>Timesheet #{timesheet.id}</a></td>
                  <td><a style={{color: 'black'}} href={`/employees/${timesheet.employee_id}`}>Employee #{timesheet.employee_id}</a></td>
                  <td>{timesheet.start_time}</td>
                  <td>{timesheet.end_time}</td>
                  <td>{timesheet.summary_work}</td>
                  <td><button onClick={() => handleTest(timesheet.id)}>Delete</button></td>
                </tr>
              ))}
            </table>
          </div>
        ) : (
          <div>
            <p>
              <div>
                <ScheduleXCalendar calendarApp={calendar} />
              </div>
            </p>
          </div>
        )}
      </div>
      
    ) : (
      <div style={{ textAlign: 'center' }}>
        <h2>No timesheets currently</h2>
        <a href="/timesheets/new">New Timesheet</a>
      </div>
    )}
    </>
)}
