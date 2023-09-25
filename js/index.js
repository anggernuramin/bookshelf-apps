// submit form add jalankan function todo
"use strict";
let todos = [];
let searchResults = [];
const checkbox = document.getElementById("inputBookIsComplete");
const confirmDelete = document.querySelector(".wrapper-confirm-delete");
const keteranganBuku = document.getElementById("keteranganBuku");
const deleteBook = document.getElementById("deleteBook");
const batalDelete = document.getElementById("batalDelete");
const searchTodo = document.getElementById("searchBook");
const submitForm = document.getElementById("inputBook");
const RENDER_EVENT = "render-todo";
document.addEventListener("DOMContentLoaded", () => {
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

// function untuk membuat id unik
function generateId() {
  return +new Date();
}
// event untuk batal delete
batalDelete.addEventListener("click", () => {
  confirmDelete.classList.remove("show-confirm-delete");
});

// function untuk remove todo
function removeFromTodo(id) {
  if (deleteBook) {
    todos = todos.filter((item) => item.id !== id);
    document.dispatchEvent(new Event(RENDER_EVENT));
    searchResults = searchResults.filter((item) => item.id !== id);
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    return;
  }
}

// function untuk undo complete to uncomplete todo
function undoFromTodoComplete(id) {
  const findTodo = todos.filter((item) => {
    if (item.id === id) {
      return (item.isComplete = false);
    } else {
      return;
    }
  });
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// function untuk undo uncomplete to complete todo
function undoFromTodoUnComplete(id) {
  const findTodo = todos.filter((item) => {
    if (item.id === id) {
      return (item.isComplete = true);
    } else {
      return;
    }
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// event untu manipulasi konten jika checbox true or false
checkbox.addEventListener("click", () => {
  console.log(checkbox.checked);
  if (checkbox.checked) {
    keteranganBuku.innerText = "Selesai dibaca";
  } else {
    keteranganBuku.innerText = "Belum Selesai dibaca";
  }
});

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
  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  keteranganBuku.innerText = "Belum Selesai dibaca";
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
  buttonCheklist.textContent = "";
  buttonCheklist.classList.add("green");

  const buttonDelete = document.createElement("button");
  buttonDelete.textContent = "Hapus buku";
  buttonDelete.classList.add("red");

  if (todo.isComplete) {
    buttonCheklist.textContent = "Belum Selesai dibaca";
    // Tambahkan event listener untuk tombol "Selesai dibaca"
    buttonCheklist.addEventListener("click", () => {
      undoFromTodoComplete(todo.id);
    });
  } else {
    buttonCheklist.textContent = "Selesai dibaca";
    // Tambahkan event listener untuk tombol "Selesai dibaca"
    buttonCheklist.addEventListener("click", () => {
      undoFromTodoUnComplete(todo.id);
    });

    // Tambahkan event listener untuk tombol "Hapus buku"
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

// event untuk fitur search by Title
searchTodo.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchBookTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  console.log("value", searchBookTitle);
  searchResults = todos.filter((item) => item.title.toLowerCase().includes(searchBookTitle));
  renderResults();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

// Fungsi untuk menampilkan hasil pencarian atau juga todos
function renderResults() {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  const resultsToDisplay = searchResults.length > 0 ? searchResults : todos;

  if (resultsToDisplay.length === 0) {
    console.log("kosong");
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "Buku yang anda cari tidak ada!.";
    incompleteBookshelfList.appendChild(noResultsMessage);
  } else {
    resultsToDisplay.forEach((result) => {
      const resultElement = makeTodo(result);
      if (result.isComplete) {
        completeBookshelfList.append(resultElement);
      } else {
        incompleteBookshelfList.append(resultElement);
      }
    });
  }
}

// custom event sebagai patokan jika ada perubahan pada variable todos
document.addEventListener(RENDER_EVENT, () => {
  renderResults();
  console.log(todos);
});
