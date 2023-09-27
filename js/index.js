"use strict";
let books = [];
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
const searchBooks = document.getElementById("searchBook");
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
  searchBooks.addEventListener("submit", (event) => {
    event.preventDefault();
    searchResults = searchBook();
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
  function searchBook() {
    const searchBookTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    return books.filter((item) => item.title.toLowerCase().includes(searchBookTitle));
  }

  // function untuk membuat id unik
  function generateId() {
    return +new Date();
  }

  // function untuk remove todo
  function removeFromBooks(id) {
    if (deleteBook) {
      books = books.filter((item) => item.id !== id);
      searchResults = searchResults.filter((item) => item.id !== id);
      saveBooks();
      renderResults();
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk undo complete to uncomplete todo
  function undoFromBookComplete(id) {
    const findBook = books.filter((item) => {
      if (item.id === id) {
        return (item.isComplete = false);
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk undo uncomplete to complete todo
  function undoFromBookUnComplete(id) {
    const findTodo = books.filter((item) => {
      if (item.id === id) {
        return (item.isComplete = true);
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk meambahkan todo ke dalam books
  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const timestamp = document.getElementById("inputBookYear").value;
    const checkbox = document.getElementById("inputBookIsComplete").checked;

    const book = {
      id: generateId(),
      title,
      author,
      year: parseInt(timestamp),
      isComplete: checkbox,
    };
    books = [...books, book];
    searchResults = [...searchResults, book];

    saveBooks();
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
    keteranganBuku.innerText = "Belum Selesai dibaca";
    renderResults();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // function untuk membuat todo
  function make(book) {
    const titleElement = document.createElement("h3");
    titleElement.innerText = book.title;
    titleElement.innerText = `Judul : ${book.title}`;
    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis : ${book.author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun : ${book.year}`;

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

    if (book.isComplete) {
      ketButtonUndo.textContent = "Belum Selesai dibaca";
      buttonCheklist.append(iconUndo, ketButtonUndo);
      buttonCheklist.addEventListener("click", () => {
        undoFromBookComplete(book.id);
      });
    } else {
      ketButtonUndo.textContent = "Selesai dibaca";
      buttonCheklist.append(iconUndo, ketButtonUndo);
      buttonCheklist.addEventListener("click", () => {
        undoFromBookUnComplete(book.id);
      });
    }
    buttonDelete.addEventListener("click", () => {
      showDeleteConfirmation(book.id);
    });
    divWrapperButtons.append(buttonCheklist, buttonDelete);

    articleElement.append(titleElement, authorElement, yearElement);
    articleElement.appendChild(divWrapperButtons);

    articleElement.setAttribute("id", `book-${book.id}`);
    return articleElement;
  }
  // function untuk menghapus semua book dari books by Id
  function showDeleteAllConfirmation() {
    confirmDeleteAll.classList.add("show-confirm-delete-all");

    const deleteAllBook = document.getElementById("deleteAllBook");
    deleteAllBook.addEventListener("click", () => {
      books = [];
      searchResults = [];
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

  // function untuk menghapus todo dari books by Id
  function showDeleteConfirmation(id) {
    confirmDelete.classList.add("show-confirm-delete");

    deleteBook.addEventListener("click", () => {
      removeFromBooks(id);
      confirmDelete.classList.remove("show-confirm-delete");
    });

    batalDelete.addEventListener("click", () => {
      id = "";
      confirmDelete.classList.remove("show-confirm-delete");
    });
  }

  // Fungsi untuk menampilkan hasil pencarian atau juga books
  function renderResults() {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    const resultsToDisplay = searchResults.length > 0 ? searchResults : books;

    resultsToDisplay.forEach((result) => {
      const resultElement = make(result);
      if (result.isComplete) {
        completeBookshelfList.append(resultElement);
      } else {
        incompleteBookshelfList.append(resultElement);
      }
    });
  }

  // function toggle button delete all
  function showButtonDeleteAll() {
    if (books.length === 0) {
      deleteAll.style.display = "none";
    } else {
      deleteAll.style.display = "block";
    }
  }

  // function untuk menyimpan todo ke local-storange
  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
  }
  // even submit add todo
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderResults();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  showButtonDeleteAll();
  // custom event sebagai patokan jika ada perubahan pada variable books

  document.addEventListener(RENDER_EVENT, () => {
    showButtonDeleteAll();
    saveBooks();
    renderResults();
  });
});
