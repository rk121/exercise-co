window.onload = async function () {
  const searchBox = document.querySelector("#search");
  const searchBtn = document.querySelector("#submit");
  const exerciseContainer = document.querySelector(".exercises");
  const paginationBtns = document.querySelector(".pagination");
  const sortBtn = document.querySelector("#sort-order");
  const filters = document.querySelector("#filter-form");
  const overlay = document.querySelector(".overlay");
  const overlayImg = document.querySelector(".zoomedImg img");

  const rows = 15;
  let currentPage = 1;

  let searchActive = false;
  let currentSearchTerm;

  let exercises = [];

  let sortOrder = "ascending";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": config.SECRET_API_KEY,
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
    if (data.length > 0) {
      wrapper.innerHTML = "";
      page--;

      let start = rowsPerPage * page;
      let end = start + rowsPerPage;
      let paginatedItems = data.slice(start, end);

      for (let i = 0; i < paginatedItems.length; i++) {
        let exercise = paginatedItems[i];
        const card = document.createElement("div");
        const imgCard = document.createElement("div");
        const img = document.createElement("img");
        const exerciseInfo = document.createElement("div");

        exerciseInfo.innerHTML = `
      <ul class="exercise-info">
                <li class="name">
                <strong>Exercise:</strong> <span class="italics">${exercise.name}</span>
                </li>
                <br>
                <li class="Body Part"><strong>Body Part:</strong> <span class="italics"">${exercise.bodyPart}</span></li>
                <br>
                <li class="equipment"><strong>Equipment:</strong> <span class="italics">${exercise.equipment}</span></li>
                <br>
                <li class="target"><strong>Target:</strong> <span class="italics">${exercise.target}</span></li>
              </ul>
      `;

        img.src =
          exercise.gifUrl != undefined
            ? exercise.gifUrl
            : "./images/default.image.png";
        img.onerror = () => {
          this.onerror = null;
          this.src = "./images/default_image.png";
        };
        img.alt = exercise.name;

        card.classList.add("card");
        imgCard.classList.add("img");
        exerciseInfo.classList.add("exercise-info-container");

        imgCard.append(img);
        card.append(imgCard, exerciseInfo);

        wrapper.append(card);

        img.addEventListener("click", (e) => {
          const imgSrc = e.target.src;
          openOverlay(imgSrc);
        });
      }
    } else {
      wrapper.innerHTML = "<h3>No exercise found!</h3>";
    }
  }

  function openOverlay(imgSrc) {
    overlayImg.src = imgSrc;
    overlay.style.display = "flex";
  }

  function closeOverlay() {
    overlayImg.src = "";
    overlay.style.display = "none";
  }

  overlay.addEventListener(
    "click",
    (event) => {
      // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
      if (
        event.target.matches(".closeBtn") ||
        !event.target.closest(".zoomedImg")
      ) {
        closeOverlay();
      }
    },
    false
  );

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

  let currentlyDisplayedExercises = exercises;

  function sortByAlpha() {
    const sortExercise = currentlyDisplayedExercises;
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
      currentlyDisplayedExercises = filteredData;

      displayExercises(filteredData, exerciseContainer, rows, currentPage);
      setUpPagination(filteredData, paginationBtns, rows);
    } else if (!searchTerm && !searchActive && filterList.length > 0) {
      const filteredData = filterExercises(exercises, filterList);
      currentlyDisplayedExercises = filteredData;

      displayExercises(filteredData, exerciseContainer, rows, currentPage);
      setUpPagination(filteredData, paginationBtns, rows);
    } else {
      const searchResult = filterExercises(exercises, [searchTerm]);
      currentlyDisplayedExercises = searchResult;

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
      currentlyDisplayedExercises = exercises;
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
      currentlyDisplayedExercises = exercises;
      displayExercises(exercises, exerciseContainer, rows, currentPage);
      setUpPagination(exercises, paginationBtns, rows);
    }
  });
};
