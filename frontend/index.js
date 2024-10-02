import { backend } from "declarations/backend";

const calendarGrid = document.getElementById("calendar-grid");
const currentMonthElement = document.getElementById("current-month");
const toggleViewButton = document.getElementById("toggle-view");
const calendarContainer = document.getElementById("calendar-container");
const meetingsView = document.getElementById("meetings-view");
const meetingsList = document.getElementById("meetings-list");
const weekdaysContainer = document.getElementById("weekdays");

let currentDate = new Date();
let meetings = {};

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

async function fetchMeetings() {
  const allMeetings = await backend.getAllMeetings();
  meetings = Object.fromEntries(allMeetings);
}

function renderWeekdays() {
  weekdaysContainer.innerHTML = daysOfWeek.map(day => 
    `<div class="text-xs text-white text-center bg-[#323232] py-1 px-0.5 rounded-xl">${day}</div>`
  ).join('');
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthElement.innerHTML = `${new Date(year, month).toLocaleString('default', { month: 'long' })} <span class="opacity-50">${year}</span>`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  calendarGrid.innerHTML = "";

  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("calendar-day", "empty", "bg-zinc-700/20");
    calendarGrid.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day", "bg-[#1e1e1e]");
    dayElement.style.height = "4rem";
    dayElement.style.borderRadius = "16px";

    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMeetings = meetings[dateString];

    const dayContent = document.createElement("div");
    dayContent.classList.add("flex", "flex-col", "items-center", "justify-center", "h-full");
    dayContent.innerHTML = `<span class="text-sm text-white">${day}</span>`;

    if (dayMeetings) {
      dayElement.classList.add("cursor-pointer");
      const meetingCount = document.createElement("div");
      meetingCount.classList.add("meeting-count", "absolute", "bottom-1", "right-1", "size-5", "rounded-full", "bg-zinc-700", "text-white", "text-[10px]", "font-bold", "flex", "items-center", "justify-center");
      meetingCount.textContent = dayMeetings.length;
      dayElement.appendChild(meetingCount);

      dayElement.addEventListener("click", () => showMeetingsForDay(dateString));
      dayElement.addEventListener("mouseenter", () => {
        meetingCount.classList.add("hover-effect");
      });
      dayElement.addEventListener("mouseleave", () => {
        meetingCount.classList.remove("hover-effect");
      });
    }

    dayElement.appendChild(dayContent);
    calendarGrid.appendChild(dayElement);
  }
}

function showMeetingsForDay(date) {
  const dayMeetings = meetings[date] || [];
  const meetingsHTML = dayMeetings.map(meeting => `
    <div class="meeting p-3 border-b last:border-b-0 border-[#323232]">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-white">${meeting.date}</span>
        <span class="text-sm text-white">${meeting.time}</span>
      </div>
      <h3 class="font-semibold text-lg mb-1 text-white">${meeting.title}</h3>
      <p class="text-sm text-zinc-600 mb-1">${meeting.participants.join(", ")}</p>
      <div class="flex items-center text-blue-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <span class="text-sm">${meeting.location}</span>
      </div>
    </div>
  `).join("");

  meetingsList.innerHTML = `<h2 class="text-2xl font-bold text-white p-3">Meetings for ${date}</h2>${meetingsHTML}`;
  calendarContainer.style.display = "none";
  meetingsView.style.display = "block";
}

function showAllMeetings() {
  const allMeetingsHTML = Object.entries(meetings).map(([date, dayMeetings]) => `
    <h2 class="text-2xl font-bold text-white p-3">${date}</h2>
    ${dayMeetings.map(meeting => `
      <div class="meeting p-3 border-b last:border-b-0 border-[#323232]">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-white">${meeting.date}</span>
          <span class="text-sm text-white">${meeting.time}</span>
        </div>
        <h3 class="font-semibold text-lg mb-1 text-white">${meeting.title}</h3>
        <p class="text-sm text-zinc-600 mb-1">${meeting.participants.join(", ")}</p>
        <div class="flex items-center text-blue-500">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <span class="text-sm">${meeting.location}</span>
        </div>
      </div>
    `).join("")}
  `).join("");

  meetingsList.innerHTML = allMeetingsHTML;
  calendarContainer.style.display = "none";
  meetingsView.style.display = "block";
}

toggleViewButton.addEventListener("click", () => {
  if (calendarContainer.style.display === "none") {
    calendarContainer.style.display = "block";
    meetingsView.style.display = "none";
    document.getElementById("toggle-slider").style.transform = "translateY(-50%) translateX(4px)";
  } else {
    showAllMeetings();
    document.getElementById("toggle-slider").style.transform = "translateY(-50%) translateX(40px)";
  }
});

async function init() {
  await fetchMeetings();
  renderWeekdays();
  renderCalendar();
}

init();
