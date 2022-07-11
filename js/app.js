window.onload = async function () {
  const searchBox = document.querySelector("#search");
  const searchBtn = document.querySelector("#submit");
  const exerciseWrapper = document.querySelector("#exercise-container");
  const exerciseContainer = document.querySelector(".exercises");
  const paginationBtns = document.querySelector(".pagination");
  const sortBtn = document.querySelector("#sort-order");
  const filters = document.querySelector("#filter-form");
  const exerciseCards = document.querySelectorAll(".card");

  const rows = 15;
  let currentPage = 1;

  let searchActive = false;
  let currentSearchTerm;

  let exercises = [
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "chest",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "assisted pull up",
      target: "glutes",
    },
    {
      bodyPart: "abs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "assisted sit up",
      target: "glutes",
    },
    {
      bodyPart: "chest",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "assisted sit down",
      target: "abs",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
    },
    {
      bodyPart: "upper legs",
      equipment: "body weight",
      gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3543.gif",
      id: "3543",
      name: "bodyweight drop jump squat",
      target: "glutes",
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

  await fetch("https://exercisedb.p.rapidapi.com/exercises", options)
    .then((response) => response.json())
    .then((response) => {
      exercises = response;
      displayExercises(exercises, exerciseContainer, rows, currentPage);
      setUpPagination(exercises, paginationBtns, rows);
    })
    .catch((err) => console.log(err));

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
      setUpPagination(items, paginationBtns, rows);
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
    setUpPagination(sortedExercise, paginationBtns, rows);
  }

  sortBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sortByAlpha();
  });

  function filterExercises(exercisesArray, filterList) {
    return exercisesArray.filter((exercise) => {
      return filterList.some((filter) => {
        return Object.values(exercise).find((text) => text.includes(filter));
      });
    });
  }

  function filterAndSearch(filterList, searchTerm) {
    if (searchTerm && filterList.length > 0) {
      const searchResult = filterExercises(exercises, [searchTerm]);
      const filteredData = filterExercises(searchResult, filterList);

      displayExercises(filteredData, exerciseContainer, rows, currentPage);
      setUpPagination(filteredData, paginationBtns, rows);
    } else if (!searchTerm && !searchActive && filterList.length > 0) {
      const filteredData = filterExercises(exercises, filterList);

      displayExercises(filteredData, exerciseContainer, rows, currentPage);
      setUpPagination(filteredData, paginationBtns, rows);
    } else {
      const searchResult = filterExercises(exercises, [searchTerm]);

      displayExercises(searchResult, exerciseContainer, rows, currentPage);
      setUpPagination(searchResult, paginationBtns, rows);
    }
  }

  function getFilterList() {
    const filtersCheckBox = document.querySelectorAll('input[type="checkbox"]');
    const filterList = [...filtersCheckBox]
      .filter((filter) => filter.checked)
      .map((filterInput) => filterInput.getAttribute("name"));
    return filterList;
  }

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const filterList = getFilterList();
    if (searchBox.value != "") {
      searchActive = true;
      currentSearchTerm = searchBox.value.toLowerCase();
      filterAndSearch(filterList, currentSearchTerm);
      searchBox.value = "";
    } else if (filterList.length > 0) {
      searchActive = false;
      filterAndSearch(filterList);
    } else {
      displayExercises(exercises, exerciseContainer, rows, currentPage);
      setUpPagination(exercises, paginationBtns, rows);
    }
  });

  filters.addEventListener("change", (e) => {
    const filterList = getFilterList();
    if (searchActive) {
      filterAndSearch(filterList, currentSearchTerm);
    } else if (filterList.length > 0) {
      filterAndSearch(filterList);
    } else {
      displayExercises(exercises, exerciseContainer, rows, currentPage);
      setUpPagination(exercises, paginationBtns, rows);
    }
  });
};
