// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: "todo-be0ac",
  storageBucket: "todo-be0ac.appspot.com",
  messagingSenderId: "736527683998",
  appId: "1:736527683998:web:813c4687274705c620c68f",
  measurementId: "G-NZLX0VH544",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

$(document).ready(function () {
  const $todoInput = $("#todo-input");
  const $todoList = $("#todo-list");
  const $addTodoButton = $("#add-todo");

  // Function to add a to-do item
  function addTodo() {
    const task = $todoInput.val().trim();
    if (task) {
      const todosRef = ref(database, "todos");
      const newTodoRef = push(todosRef);
      set(newTodoRef, { task, completed: false });
      $todoInput.val("");
    }
  }

  // Function to render a single to-do item
  function renderTodoItem(key, todo) {
    const $todoItem = $(`
        <li class="list-group-item d-flex justify-content-between align-items-center" data-key="${key}">
            <div class="form-check">
                <input type="checkbox" class="form-check-input" ${
                  todo.completed ? "checked" : ""
                }>
                <label class="form-check-label">${todo.task}</label>
            </div>
            <button class="btn btn-danger btn-sm remove-todo">Remove</button>
        </li>
    `);

    $todoList.append($todoItem);
  }

  // Setup real-time listeners
  const todosRef = ref(database, "todos");

  onChildAdded(todosRef, (snapshot) => {
    const todo = snapshot.val();
    const key = snapshot.key;
    renderTodoItem(key, todo);
  });

  onChildChanged(todosRef, (snapshot) => {
    const todo = snapshot.val();
    const key = snapshot.key;
    const $todoItem = $todoList.find(`li[data-key="${key}"]`);
    $todoItem.find('input[type="checkbox"]').prop("checked", todo.completed);
    $todoItem.find("span").text(todo.task);
  });

  onChildRemoved(todosRef, (snapshot) => {
    const key = snapshot.key;
    $todoList.find(`li[data-key="${key}"]`).remove();
  });

  // Add event listeners
  $addTodoButton.on("click", addTodo);

  $todoList.on("change", 'input[type="checkbox"]', function () {
    const $li = $(this).closest("li");
    const key = $li.data("key");
    const completed = $(this).is(":checked");
    const todoRef = ref(database, "todos/" + key);
    update(todoRef, { completed });
  });

  $todoList.on("click", ".remove-todo", function () {
    const $li = $(this).closest("li");
    const key = $li.data("key");
    const todoRef = ref(database, "todos/" + key);
    remove(todoRef);
  });
});
