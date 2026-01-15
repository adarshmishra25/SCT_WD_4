const input = document.getElementById("text");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const noTaskImg = document.getElementById("notask");
const number = document.getElementById("outof");
const barlength = document.getElementById("comBar");
const range = document.getElementById("range");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

function updateTime() {
  const d = new Date();

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, "0");
  timeEl.innerText = `${hours}:${minutes} ${ampm}`;
  dateEl.innerText = `${day} : ${month} : ${year}`;
}
updateTime();

setInterval(updateTime, 1000);

let itemArray = JSON.parse(localStorage.getItem("items")) || [];

addBtn.addEventListener("click", () => {
  const task = input.value.trim();
  if (task === "") return;

  itemArray.push({
    text: task,
    completed: false
  });

  saveItems();
  renderItems();
  input.value = "";
});

function renderItems() {

  taskList.innerHTML = "";

  itemArray.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", item.completed);

    li.innerHTML = `
      <div>
        <input type="checkbox" class="check" ${item.completed ? "checked" : ""}>
        <span>${item.text}</span>
      </div>
      <img src="photos/cross.svg" alt="delete">
    `;

    const checkbox = li.querySelector(".check");

    checkbox.addEventListener("change", () => {
      itemArray[index].completed = checkbox.checked;
      saveItems();
      renderItems();
    });

    li.querySelector("img").addEventListener("click", () => {
      itemArray.splice(index, 1);
      saveItems();
      renderItems();
    });

    taskList.appendChild(li);
  });

  checkTask();
  bar();
}


function saveItems() {
  localStorage.setItem("items", JSON.stringify(itemArray));
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});


function bar() {
  const completed = document.querySelectorAll(".check:checked").length;
  const total = document.querySelectorAll(".check").length;

  if (total === 0) {
    barlength.style.width = "0%";
    number.innerText = "0 / 0";
    return;
  }

  const percent = (completed / total) * 100;
  barlength.style.width = percent + "%";

  barlength.classList.remove("animate");
  void barlength.offsetWidth; // force reflow
  barlength.classList.add("animate");

  if (completed === total) {
    number.innerHTML = `All Complete 🎉 <br> ${completed} / ${total}`;
    barlength.classList.add("complete");
  } else {
    number.innerHTML = `On Going Tasks ⏱️ <br> ${completed} / ${total}`;
    barlength.classList.remove("complete");
  }
}



function checkTask() {
  if (taskList.children.length === 0) {
    noTaskImg.style.display = "block";
    range.style.display = "none";
  } else {
    noTaskImg.style.display = "none";
    range.style.display = "flex";
  }
}

renderItems();
