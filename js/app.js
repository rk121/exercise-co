window.onload = async function () {
  const searchBox = document.querySelector("#search");
  const submitBtn = document.querySelector("#submit");
  const exerciseContainer = document.querySelector(".exercises");
  const paginationBtns = document.querySelector(".pagination");
  const sortBtn = document.querySelector("#sort-order");
  const filters = document.querySelector("#filter-form");
  const exerciseCards = document.querySelectorAll(".card");

  const rows = 15;
  let currentPage = 1;

  let filteredExercises;
  const filterList = [];

  let exercises = [
    {
      bodyPart: "waist",
      equipment: "body weight",
      id: "0001",
      name: "a",
      target: "abs",
    },
    {
      bodyPart: "back",
      equipment: "barbell",
      id: "0001",
      name: "b",
      target: "lats",
    },
    {
      bodyPart: "lower arms",
      equipment: "dumbell",
      id: "0001",
      name: "c",
      target: "biceps",
    },
    {
      bodyPart: "legs",
      equipment: "barbell",
      id: "0001",
      name: "d",
      target: "forearms",
    },
  ];

  let sortOrder = "ascending";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8a92799449msh491f63a48712988p129f4ajsn6780776ab20a",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  // await fetch("https://exercisedb.p.rapidapi.com/exercises", options)
  //   .then((response) => response.json())
  //   .then((response) => {
  //     exercises = response;
  //     displayExercises(exercises, exerciseContainer, rows, currentPage);
  //     setUpPagination(exercises, paginationBtns, rows);
  //   })
  //   .catch((err) => console.log(err));

  displayExercises(exercises, exerciseContainer, rows, currentPage);

  function displayExercises(data, wrapper, rowsPerPage, page) {
    wrapper.innerHTML = "";
    page--;

    let start = rowsPerPage * page;
    let end = start + rowsPerPage;
    let paginatedItems = data.slice(start, end);

    // sortBtn.addEventListener("click", sortByAlpha(paginatedItems));

    for (let i = 0; i < paginatedItems.length; i++) {
      let exercise = paginatedItems[i];
      wrapper.innerHTML += `
      <div class="card">
            <div class="img">
              <img src="${exercise.gifUrl}" onerror="this.onerror=null;this.src='./images/demo.gif';" alt="${exercise.name}" />
            </div>
            <div class="exercise-info-container">
              <ul class="exercise-info">
                <li class="name">
                <strong>Exercise:</strong> <span class="italics">${exercise.name}</span>
                </li>
                <li class="Body Part"><strong>Body Part:</strong> <span class="italics"">${exercise.bodyPart}</span></li>
                <li class="equipment"><strong>Equipment:</strong> <span class="italics">${exercise.equipment}</span></li>
                <li class="target"><strong>Target:</strong> <span class="italics">${exercise.target}</span></li>
              </ul>
            </div>
          </div>
      `;
    }
  }

  function setUpPagination(items, wrapper, rowsPerPage) {
    wrapper.innerHTML = "";
    let pageCount = Math.ceil(items.length / rowsPerPage);
    const paginationRange = 4;

    const minRange =
      currentPage - paginationRange < 1 ? 1 : currentPage - paginationRange;
    const maxRange =
      currentPage + paginationRange > pageCount
        ? pageCount
        : currentPage + paginationRange;

    if (currentPage > 1 && pageCount > 4) {
      let prevBtn = paginationBtn(currentPage - 1, items, "<");
      let firstPage = paginationBtn(1, items, "<<");
      prevBtn.classList.add("paginationArrows");
      firstPage.classList.add("paginationArrows");
      wrapper.append(firstPage);
      wrapper.append(prevBtn);
    }

    for (let i = minRange; i <= maxRange; i++) {
      let btn = paginationBtn(i, items);
      wrapper.append(btn);
    }

    if (currentPage < pageCount && pageCount > 4) {
      let nextBtn = paginationBtn(currentPage + 1, items, ">");
      let lastPage = paginationBtn(pageCount, items, ">>");
      nextBtn.classList.add("paginationArrows");
      lastPage.classList.add("paginationArrows");
      wrapper.append(nextBtn);
      wrapper.append(lastPage);
    }
  }

  function paginationBtn(page, items, name = null) {
    const btn = document.createElement("button");
    btn.innerText = name ? name : page;

    if (currentPage == page) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", function (e) {
      currentPage = page;
      displayExercises(items, exerciseContainer, rows, currentPage);
      // let currentBtn = document.qurySelector(".pagination button.active");
      // currentBtn.classList.remove("active");

      setUpPagination(items, paginationBtns, rows);

      // e.target.classList.add("active");
    });

    return btn;
  }

  function sortByAlpha() {
    const sortExercise = filteredExercises ? filteredExercises : exercises;
    let sortedExercise;
    if (sortOrder === "descending") {
      sortOrder = "ascending";
      sortedExercise = sortExercise.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else {
      sortOrder = "descending";
      sortedExercise = sortExercise.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        }
        if (a.name < b.name) {
          return 1;
        }
        return 0;
      });
    }
    displayExercises(sortedExercise, exerciseContainer, rows, currentPage);
  }

  filters.addEventListener("change", (e) => {
    const filterBy = e.target.getAttribute("name");
    if (e.target.checked && !filterList.includes(filterBy)) {
      filterList.push(filterBy);
      filterExercises(filterList);
    } else if (filterList.indexOf(filterBy) > -1) {
      const index = filterList.indexOf(filterBy);
      filterList.splice(index, 1);
    }

    if (filterList.length > 0) {
      filterExercises(filterList);
    } else {
      filteredExercises = null;
      displayExercises(exercises, exerciseContainer, rows, currentPage);
    }
  });

  function filterExercises(arrayOfFilters) {
    console.log(filterList);

    filteredExercises = exercises.filter((excercise) => {
      return filterList.some((filter) => {
        return Object.values(excercise).includes(filter);
      });
    });

    displayExercises(filteredExercises, exerciseContainer, rows, currentPage);
    setUpPagination(filteredExercises, paginationBtns, rows);
  }

  sortBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sortByAlpha();
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchBy = searchBox.value;
    filterList.push(searchBy);
    searchBox.value = "";
    filterExercises(filterList);
  });
};
