let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", renderTasks);

function addTask(columnId) {
  const taskInput = document.getElementById("taskInput");
  const taskContent = taskInput.value.trim();
  if (taskContent !== "") {
    const newTask = {
      id: "task-" + Date.now(),
      content: taskContent,
      status: columnId,
    };
    tasks.push(newTask);
    updateLocalStorage();
    renderTasks();
    taskInput.value = "";
  }
}

function renderTasks() {
  const columns = ["todo", "in-progress", "done"];

  columns.forEach((columnId) => {
    const column = document.getElementById(columnId);
    column.querySelector(".task-container").innerHTML = "";

    tasks.forEach((task) => {
      if (task.status === columnId) {
        const taskElement = createTaskElement(task.content, task.id);
        column.querySelector(".task-container").appendChild(taskElement);
      }
    });
  });
}

function createTaskElement(content, id) {
  const taskId = id;
  const task = document.createElement("div");
  task.id = taskId;
  task.className = "task";
  task.draggable = true;
  task.innerHTML = `
    ${content}
    <span class="delete-btn" onclick="deleteTask('${taskId}')">❌</span>
  `;
  task.addEventListener("dragstart", drag);
  task.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });
  return task;
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  updateLocalStorage();
  renderTasks();
}

function allowDrop(event) {
  event.preventDefault();
  const column = event.target.closest(".column");
  if (column) {
    column.classList.add("drag-over");
  }
}

function drag(event) {
  const element = event.target;
  element.classList.add("dragging");
  event.dataTransfer.setData("text/plain", element.id);
  event.dataTransfer.effectAllowed = "move";
  const rect = element.getBoundingClientRect();
  event.dataTransfer.setDragImage(element, rect.width / 2, rect.height / 2);
}

function drop(event, columnId) {
  event.preventDefault();
  const column = event.target.closest(".column");
  if (column) {
    column.classList.remove("drag-over");
  }
  const data = event.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(data);
  if (draggedElement) {
    draggedElement.classList.remove("dragging");
    const taskStatus = columnId;
    updateTaskStatus(data, taskStatus);
  }
}

function updateTaskStatus(taskId, newStatus) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        status: newStatus,
      };
    }
    return task;
  });
  updateLocalStorage();
  renderTasks();
}

document.addEventListener("DOMContentLoaded", function () {
  const columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    column.addEventListener("dragleave", (e) => {
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove("drag-over");
      }
    });
  });
});
