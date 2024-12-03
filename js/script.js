// Variables
const openButton = document.getElementById("openButton");
const sideBar = document.getElementById("sideBar");
const blurBackground = document.getElementById("blur");
const body = document.body;

openButton.addEventListener("click", () => {
  sideBar.classList.toggle("hide");
  sideBar.classList.toggle("show");
  if (sideBar.classList == "show") {
    blurBackground.classList.add("on");
    body.style.overflow = "hidden";
  } else {
    blurBackground.classList.remove("on");
    body.style.overflow = "auto";
  }
});

// pagination func
let currentPage = 1;
const itemsPerPage = 8;
let totalUsers = [];
let totalPages = 1;

const fetchData = (page) => {
  fetch("https://dummyjson.com/users")
    .then((res) => res.json())
    .then((data) => {
      let users = data.users;

      while (users.length < 160) {
        users = users.concat(data.users);
      }

      totalUsers = users.slice(0, 160);
      totalPages = Math.ceil(totalUsers.length / itemsPerPage);

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const usersToDisplay = totalUsers.slice(start, end);

      const tbody = document.querySelector(".table tbody");
      tbody.innerHTML = "";

      // render rows here
      usersToDisplay.forEach((user) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td title="${user.firstName + " " + user.lastName}">${truncate(
          user.firstName + " " + user.lastName,
          15
        )}</td> <!-- Customer Name -->
            <td title="${user.company?.name}">${truncate(
          user.company?.name || "N/A",
          15
        )}</td> <!-- Company -->
            <td title="${user.phone}" >${truncate(
          user.phone,
          15
        )}</td> <!-- Phone Number -->
            <td title="${user.email}" >${truncate(
          user.email,
          15
        )}</td> <!-- Email -->
            <td title="${user.address?.country}" >${truncate(
          user.address?.country || "N/A",
          15
        )}</td> <!-- Country -->
            <td>
            <span class="${user.gender == "male" ? "green" : "red"}">${truncate(
          user.gender == "male" ? "Active" : "Inactive",
          15
        )}</span>
            </td> <!-- Status -->
          `;

        tbody.appendChild(row);
      });

      updatePagination();
    })
    .catch((error) => console.error("Error fetching data:", error));
};

const truncate = (text, limit) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const updatePagination = () => {
  const paginationContainer = document.querySelector(".pagination");
  const pageInfo = document.querySelector(".table_info");

  // Update page info
  pageInfo.textContent = `Showing data ${
    (currentPage - 1) * itemsPerPage + 1
  } to ${Math.min(currentPage * itemsPerPage, totalUsers.length)} of ${
    totalUsers.length
  } entries`;

  paginationContainer.innerHTML = "";

  const createPageButton = (pageNumber) => {
    const button = document.createElement("button");
    button.textContent = pageNumber;
    button.disabled = pageNumber === currentPage;
    button.classList.toggle("active", pageNumber === currentPage);
    button.addEventListener("click", () => {
      currentPage = pageNumber;
      fetchData(currentPage);
    });
    return button;
  };

  const pages = [];
  const maxPageButtons = 4;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  //
  if (currentPage <= 3) {
    endPage = Math.min(totalPages, 4);
  }
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 3);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(createPageButton(i));
  }

  if (endPage < totalPages) {
    const ellipsisButton = document.createElement("button");
    ellipsisButton.textContent = "...";
    ellipsisButton.classList.add("dot_button");
    ellipsisButton.disabled = true;
    pages.push(ellipsisButton);

    const lastPageButton = document.createElement("button");
    lastPageButton.textContent = totalPages;
    lastPageButton.addEventListener("click", () => {
      currentPage = totalPages;
      fetchData(currentPage);
    });
    pages.push(lastPageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;
  nextButton.addEventListener("click", goToNextPage);

  const prevButton = document.createElement("button");
  prevButton.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
  prevButton.addEventListener("click", goToPreviousPage);

  paginationContainer.appendChild(prevButton);
  pages.forEach((pageButton) => paginationContainer.appendChild(pageButton));
  paginationContainer.appendChild(nextButton);
};

const goToPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
};

const goToNextPage = () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchData(currentPage);
  }
};

fetchData(currentPage);
