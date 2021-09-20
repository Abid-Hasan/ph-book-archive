document.getElementById("search-button").addEventListener("click", () => {
    showMessage("");

    const searchInput = document.getElementById("search-input");
    if (searchInput.value === "") {
        showMessage("Write something in the search box first.");
        return;
    }

    showLoading(true);
    searchBooks(searchInput.value);
    searchInput.value = "";
});

const searchBooks = (bookName) => {
    const url = `https://openlibrary.org/search.json?q=${bookName}`;
    // calling API
    fetch(url)
        .then(response => response.json())
        .then(data => displayBooks(data));
};

const displayBooks = (data) => {
    showLoading(false);

    // clearing book display grid
    const bookDisplay = document.getElementById("book-display");
    bookDisplay.innerHTML = "";

    // search result summary
    if (data.numFound === 0) {
        showMessage("No book found. Try with a different keyword.");
        return;
    }
    else if (data.numFound === 1) {
        showMessage(data.numFound + " book found");
    }
    else {
        showMessage(data.numFound + " books found");
    }

    // loading data into book display grid
    const books = data.docs;

    books.forEach(book => {
        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
        <div class="card">
            <img src="${getBookImageUrl(book)}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <div class="card-text">${getBookInfo(book)}</div>
            </div>
        </div>
        `;
        bookDisplay.appendChild(div);
    });
};

const getBookImageUrl = book => {
    if (book.cover_i === undefined) {
        return "images/noImage.jpg"
    }

    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
};

const getBookInfo = book => {
    let info = "";

    // Getting author names list
    if (book.author_name !== undefined && book.author_name.length !== 0) {
        info += `
        <p>Author:
            <ul>
        `;
        book.author_name.forEach(author => {
            info += `<li>${author}</li>`;
        });
        info += `
            </ul>
        </p>
        `;
    }

    // Getting first published
    if (book.first_publish_year !== undefined) {
        info += `
        <p>First published: ${book.first_publish_year} </p>
        `;
    }

    return info;
};

const showMessage = message => {
    const info = document.getElementById("info");
    info.innerText = message;
};

const showLoading = toShow => {
    const loading = document.getElementById("loading");
    if (toShow) loading.classList.remove("d-none");
    else loading.classList.add("d-none");
};