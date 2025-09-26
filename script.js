document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskDeadline = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterTasks = document.getElementById("filterTasks");
const clearAllBtn = document.getElementById("clearAllBtn");

addTaskBtn.addEventListener("click", addTask);
filterTasks.addEventListener("change", renderTasks);
clearAllBtn.addEventListener("click", clearAllTasks);

function addTask() {
  const text = taskInput.value.trim();
  let date = taskDate.value;
  const time = taskTime.value;
  const deadline = taskDeadline.value;

  if (!text) {
    alert("Введите задачу!");
    return;
  }

  if (deadline === "oneday") {
    date = new Date().toISOString().split("T")[0];
  }

  const task = {
    id: Date.now(),
    text,
    date,
    time,
    completed: false
  };

  saveTask(task);
  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
  taskTime.value = "";
  taskDeadline.value = "none";
}

function renderTasks() {
  taskList.innerHTML = "";
  let tasks = getTasks();

  // фильтр
  if (filterTasks.value === "active") {
    tasks = tasks.filter(t => !t.completed);
  } else if (filterTasks.value === "completed") {
    tasks = tasks.filter(t => t.completed);
  }

  // сортировка по дате/времени
  tasks.sort((a, b) => {
    const dateA = new Date(`${a.date || "9999-12-31"}T${a.time || "23:59"}`);
    const dateB = new Date(`${b.date || "9999-12-31"}T${b.time || "23:59"}`);
    return dateA - dateB;
  });

  tasks.forEach(renderTask);
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const details = document.createElement("div");
  details.className = "task-details";

  const text = document.createElement("span");
  text.textContent = "Задача: " + task.text;
  if (task.completed) text.classList.add("task-completed");

  const dateSpan = document.createElement("span");
  let today = new Date().toISOString().split("T")[0];

  if (task.date) {
    if (task.date === today) {
      dateSpan.innerHTML = `Дата: <span class="today-date">${formatDate(task.date)}</span>`;
    } else if (new Date(task.date) < new Date(today)) {
      dateSpan.innerHTML = `Дата: <span class="expired-date">${formatDate(task.date)}</span>`;
    } else {
      dateSpan.textContent = "Дата: " + formatDate(task.date);
    }
  } else {
    dateSpan.textContent = "Дата: Без даты";
  }

  const timeSpan = document.createElement("span");
  if (task.time) {
    timeSpan.textContent = "Время: " + task.time;
  }

  details.appendChild(text);
  details.appendChild(dateSpan);
  if (task.time) details.appendChild(timeSpan);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  li.appendChild(details);
  li.appendChild(checkbox);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function toggleTask(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function clearAllTasks() {
  if (confirm("Вы уверены, что хотите удалить все задачи?")) {
    localStorage.removeItem("tasks");
    renderTasks();
  }
}

function formatDate(dateStr) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("ru-RU", options);
}

function loadTasks() {
  renderTasks();
}
