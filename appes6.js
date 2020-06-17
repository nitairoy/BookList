// Book Constructor
class Book {
  constructor(title, writer, isbn) {
    this.title = title;
    this.writer = writer;
    this.isbn = isbn;
  }
}

// UI Constructor
class UserInterface {
  constructor() {}
  // Add book
  addBookToList(book) {
    const list = document.getElementById("book-lists");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.writer}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  // Clear input field after book added
  clearFileds() {
    document.getElementById("title").value = "";
    document.getElementById("writer").value = "";
    document.getElementById("isbn").value = "";
  }

  // show message after submit
  showMessage(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Remove after 3 sec
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
}

// local storage book
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static displayBooks() {
    // get the books
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UserInterface();

      // add book to ui
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    // console.log(isbn);
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// dom load event

document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event listener for add book
document.getElementById("book-form").addEventListener("submit", function (e) {
  // get the input value
  const title = document.getElementById("title").value,
    writer = document.getElementById("writer").value,
    isbn = document.getElementById("isbn").value;
  // instantiate book
  const book = new Book(title, writer, isbn);

  // instantiate UI
  const ui = new UserInterface();
  // validate input fields
  if (title === "" || writer === "" || isbn === "") {
    ui.showMessage("Please add book", "error");
  } else {
    ui.addBookToList(book);

    // add to ls
    Store.addBook(book);
    // clear input fields
    ui.clearFileds();

    ui.showMessage("Book added successfully", "success");
  }

  e.preventDefault();
});

// Event delegation to delete book from book list
document.getElementById("book-lists").addEventListener("click", function (e) {
  const ui = new UserInterface();

  ui.deleteBook(e.target);

  // rEmove from lS

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //   ui.showMessage("Deleted from book list", "error");

  e.preventDefault();
});
