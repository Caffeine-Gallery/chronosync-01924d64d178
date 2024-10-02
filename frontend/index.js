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
  try {
    const allMeetings = await backend.getAllMeetings();
    console.log("Raw meetings data:", allMeetings);
    meetings = Object.fromEntries(allMeetings);
    console.log("Processed meetings:", meetings);

    if (Object.keys(meetings).length === 0) {
      console.log("No meetings found. Initializing sample data...");
      await backend.initializeSampleData();
      const updatedMeetings = await backend.getAllMeetings();
      meetings = Object.fromEntries(updatedMeetings);
      console.log("Sample data initialized. Updated meetings:", meetings);
    }
  } catch (error) {
    console.error("Error fetching meetings:", error);
  }
}

function renderWeekdays() {
  weekdaysContainer.innerHTML = daysOfWeek.map(day => 
    `<div class="weekday-button text-xs text-white text-center bg-[#323232] py-1 px-0.5 rounded-xl">${day}</div>`
  ).join('');
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthElement.innerHTML = `LN <span class="opacity-50">${year}</span>`;

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

    if (dayMeetings && dayMeetings.length > 0) {
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
  console.log("Meetings for", date, ":", dayMeetings);
  const meetingsHTML = dayMeetings.map(meeting => `
    <div class="meeting p-3 border-b last:border-b-0 border-[#323232]">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-white">${meeting.date}</span>
        <span class="text-sm text-white">${meeting.time}</span>
      </div>
      <h3 class="font-semibold text-lg mb-1 text-white">${meeting.title}</h3>
      <p class="text-sm text-zinc-600 mb-1">${meeting.participants.join(", ")}</p>
      <div class="flex items-center text-blue-500">
        <i class="fas fa-video mr-1"></i>
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
          <i class="fas fa-video mr-1"></i>
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
  try {
    document.body.innerHTML += '<div id="loading" class="loading">Loading...</div>';
    await fetchMeetings();
    document.getElementById("loading").remove();
    renderWeekdays();
    renderCalendar();
  } catch (error) {
    console.error("Error initializing application:", error);
    document.body.innerHTML = `<div class="error-message">An error occurred while loading the application. Please try again later.</div>`;
  }
}

init();
