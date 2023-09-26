"use strict";
let todos = [];
let searchResults = [];
const checkbox = document.getElementById("inputBookIsComplete");
const confirmDelete = document.querySelector(".wrapper-confirm-delete");
const confirmDeleteAll = document.querySelector(".wrapper-confirm-delete-all");
const keteranganBuku = document.getElementById("keteranganBuku");
const buttonClose = document.querySelector(".close-confirm-delete");
const buttonCloseAll = document.querySelector(".close-confirm-delete-all");
const deleteBook = document.getElementById("deleteBook");
const batalDelete = document.getElementById("batalDelete");
const deleteAll = document.querySelector(".removeAllBooks");
const searchTodos = document.getElementById("searchBook");
const submitForm = document.getElementById("inputBook");

const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", () => {
  // event untuk batal delete
  batalDelete.addEventListener("click", () => {
    confirmDelete.classList.remove("show-confirm-delete");
  });

  // event untu manipulasi konten jika checbox true or false
  checkbox.addEventListener("click", () => {
    keteranganBuku.innerText = checkbox.checked ? "Selesai dibaca" : "Belum Selesai dibaca";
  });

  // event untuk fitur search by Title
  searchTodos.addEventListener("submit", (event) => {
    event.preventDefault();
    searchResults = searchTodo();
    renderResults();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  deleteAll.addEventListener("click", () => {
    showDeleteAllConfirmation();
  });

  // event untuk button close confirmation delete
  buttonClose.addEventListener("click", () => {
    confirmDelete.classList.remove("show-confirm-delete");
  });

  // event untuk button close confirmation delete All
  buttonCloseAll.addEventListener("click", () => {
    confirmDeleteAll.classList.remove("show-confirm-delete-all");
  });

  // function untuk mengambil input user
  function searchTodo() {
    const searchBookTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    return todos.filter((item) => item.title.toLowerCase().includes(searchBookTitle));
  }

  // function untuk membuat id unik
  function generateId() {
    return +new Date();
  }

  // function untuk remove todo
  function removeFromTodo(id) {
    if (deleteBook) {
      todos = todos.filter((item) => item.id !== id);
      searchResults = searchResults.filter((item) => item.id !== id);
      saveTodos();
      renderResults();
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk undo complete to uncomplete todo
  function undoFromTodoComplete(id) {
    const findTodo = todos.filter((item) => {
      if (item.id === id) {
        return (item.isComplete = false);
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk undo uncomplete to complete todo
  function undoFromTodoUnComplete(id) {
    const findTodo = todos.filter((item) => {
      if (item.id === id) {
        return (item.isComplete = true);
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk meambahkan todo ke dalam todos
  function addTodo() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const timestamp = document.getElementById("inputBookYear").value;
    const checkbox = document.getElementById("inputBookIsComplete").checked;

    const todo = {
      id: generateId(),
      title,
      author,
      year: timestamp,
      isComplete: checkbox,
    };
    todos = [...todos, todo];
    saveTodos();
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
    keteranganBuku.innerText = "Belum Selesai dibaca";

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk membuat todo
  function makeTodo(todo) {
    const titleElement = document.createElement("h3");
    titleElement.innerText = todo.title;
    titleElement.innerText = `Judul : ${todo.title}`;
    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis : ${todo.author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun : ${todo.year}`;

    const articleElement = document.createElement("article");
    articleElement.classList.add("book-item");

    const divWrapperButtons = document.createElement("div");
    divWrapperButtons.classList.add("action");

    const buttonCheklist = document.createElement("button");
    buttonCheklist.classList.add("green");
    const iconUndo = document.createElement("i");
    iconUndo.classList.add("fa-solid", "fa-arrow-rotate-left");
    const ketButtonUndo = document.createElement("span");

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("red");
    const iconDelete = document.createElement("i");
    const ketButtonDelete = document.createElement("span");
    iconDelete.classList.add("fas", "fa-trash");
    ketButtonDelete.textContent = "Hapus buku";
    buttonDelete.append(iconDelete, ketButtonDelete);

    if (todo.isComplete) {
      ketButtonUndo.textContent = "Belum Selesai dibaca";
      buttonCheklist.append(iconUndo, ketButtonUndo);
      buttonCheklist.addEventListener("click", () => {
        undoFromTodoComplete(todo.id);
      });
    } else {
      ketButtonUndo.textContent = "Selesai dibaca";
      buttonCheklist.append(iconUndo, ketButtonUndo);
      buttonCheklist.addEventListener("click", () => {
        undoFromTodoUnComplete(todo.id);
      });
    }
    buttonDelete.addEventListener("click", () => {
      showDeleteConfirmation(todo.id);
    });
    divWrapperButtons.append(buttonCheklist, buttonDelete);

    articleElement.append(titleElement, authorElement, yearElement);
    articleElement.appendChild(divWrapperButtons);

    articleElement.setAttribute("id", `todo-${todo.id}`);
    return articleElement;
  }
  // function untuk menghapus semua todo dari todos by Id
  function showDeleteAllConfirmation() {
    confirmDeleteAll.classList.add("show-confirm-delete-all");

    const deleteAllBook = document.getElementById("deleteAllBook");
    deleteAllBook.addEventListener("click", () => {
      todos = [];
      localStorage.clear();
      confirmDeleteAll.classList.remove("show-confirm-delete-all");
      showButtonDeleteAll();
      renderResults();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });

    const batalDeleteAllBook = document.getElementById("batalDeleteAllBook");
    batalDeleteAllBook.addEventListener("click", () => {
      confirmDeleteAll.classList.remove("show-confirm-delete-all");
    });
  }

  // function untuk menghapus todo dari todos by Id
  function showDeleteConfirmation(id) {
    confirmDelete.classList.add("show-confirm-delete");

    deleteBook.addEventListener("click", () => {
      removeFromTodo(id);
      confirmDelete.classList.remove("show-confirm-delete");
    });

    batalDelete.addEventListener("click", () => {
      id = "";
      confirmDelete.classList.remove("show-confirm-delete");
    });
  }

  // Fungsi untuk menampilkan hasil pencarian atau juga todos
  function renderResults() {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    const resultsToDisplay = searchResults.length > 0 ? searchResults : todos;

    resultsToDisplay.forEach((result) => {
      const resultElement = makeTodo(result);
      if (result.isComplete) {
        completeBookshelfList.append(resultElement);
      } else {
        incompleteBookshelfList.append(resultElement);
      }
    });
  }

  // function toggle button delete all
  function showButtonDeleteAll() {
    if (todos.length === 0) {
      deleteAll.style.display = "none";
    } else {
      deleteAll.style.display = "block";
    }
  }

  // function untuk menyimpan todo ke local-storange
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  // even submit add todo
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    renderResults();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  showButtonDeleteAll();

  // custom event sebagai patokan jika ada perubahan pada variable todos

  document.addEventListener(RENDER_EVENT, () => {
    showButtonDeleteAll();
    saveTodos();
    renderResults();
  });
});
