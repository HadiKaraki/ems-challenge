import '../css/Navbar.css'
export default function Navbar () {
    return (
        <nav>
            <ul>
            <li><a href="/employees">Employees</a></li>
            <li><a href="/employees/new">New Employee</a></li>
            <li><a href="/timesheets/">Timesheets</a></li>
            <li><a href="/timesheets/new">New Timesheet</a></li>
            </ul>
        </nav>
    )
}