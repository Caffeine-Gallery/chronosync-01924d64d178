import { backend } from "declarations/backend";

const calendarGrid = document.getElementById("calendar-grid");
const currentMonthElement = document.getElementById("current-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const toggleViewButton = document.getElementById("toggle-view");
const calendarContainer = document.getElementById("calendar-container");
const meetingsList = document.getElementById("meetings-list");

let currentDate = new Date();
let meetings = {};

async function fetchMeetings() {
  const allMeetings = await backend.getAllMeetings();
  meetings = Object.fromEntries(allMeetings);
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthElement.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  calendarGrid.innerHTML = "";

  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("calendar-day", "empty");
    calendarGrid.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day");
    dayElement.textContent = day;

    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (meetings[dateString]) {
      dayElement.classList.add("has-meetings");
      const meetingCount = document.createElement("span");
      meetingCount.classList.add("meeting-count");
      meetingCount.textContent = meetings[dateString].length;
      dayElement.appendChild(meetingCount);

      dayElement.addEventListener("click", () => showMeetingsForDay(dateString));
    }

    calendarGrid.appendChild(dayElement);
  }
}

function showMeetingsForDay(date) {
  const dayMeetings = meetings[date] || [];
  const meetingsHTML = dayMeetings.map(meeting => `
    <div class="meeting">
      <h3>${meeting.title}</h3>
      <p>Date: ${meeting.date}</p>
      <p>Time: ${meeting.time}</p>
      <p>Participants: ${meeting.participants.join(", ")}</p>
      <p>Location: ${meeting.location}</p>
    </div>
  `).join("");

  meetingsList.innerHTML = `<h2>Meetings for ${date}</h2>${meetingsHTML}`;
  calendarContainer.style.display = "none";
  meetingsList.style.display = "block";
}

function showAllMeetings() {
  const allMeetingsHTML = Object.entries(meetings).map(([date, dayMeetings]) => `
    <h2>${date}</h2>
    ${dayMeetings.map(meeting => `
      <div class="meeting">
        <h3>${meeting.title}</h3>
        <p>Time: ${meeting.time}</p>
        <p>Participants: ${meeting.participants.join(", ")}</p>
        <p>Location: ${meeting.location}</p>
      </div>
    `).join("")}
  `).join("");

  meetingsList.innerHTML = allMeetingsHTML;
  calendarContainer.style.display = "none";
  meetingsList.style.display = "block";
}

prevMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

toggleViewButton.addEventListener("click", () => {
  if (calendarContainer.style.display === "none") {
    calendarContainer.style.display = "block";
    meetingsList.style.display = "none";
    renderCalendar();
  } else {
    showAllMeetings();
  }
});

async function init() {
  await fetchMeetings();
  renderCalendar();
}

init();
