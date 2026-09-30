let apiUrl = "http://localhost:3000/movies";

const addMovieForm = document.querySelector("#add-movie-form");
const searchMovieForm = document.querySelector("#search-movie-form")
const toggleModeBtn = document.querySelector("#toggle-mode-btn");

const ratingInput = document.querySelector("#add-rating");
const ratingOutput = document.querySelector("#rating-value");


const replaceWithForm = (switchToMode) => {
    const formToHide = switchToMode === "search" ? addMovieForm : searchMovieForm;
    const formToShow = switchToMode === "search" ? searchMovieForm : addMovieForm;
    formToHide.classList.add("hidden");
    formToShow.classList.remove("hidden");
};

const toggleMode = () => {
    toggleModeBtn.disabled = true;
    const currentMode = toggleModeBtn.dataset.mode;
    const nextMode = currentMode === "add" ? "search" : "add";
    toggleModeBtn.dataset.mode = nextMode;
    
    replaceWithForm(nextMode);
    toggleModeBtn.textContent = `Switch to ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode`;
    toggleModeBtn.disabled = false;
};

const renderResult = (data) => {
    const { title, releaseDate, rating, review, id } = data;

    const resultContainer = document.querySelector("#result-container");

    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
        <h3>"${title}"</h3>
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Date:</strong> ${releaseDate}</p>
        <p><strong>Rating:</strong> ${rating} ⭐</p>
        <p><strong>Review:</strong> ${review}</p>
    `;

    resultContainer.innerHTML = '';
    resultContainer.appendChild(card);
};

const renderError = (message) => {
    const resultContainer = document.querySelector("#result-container");
    
    // перезаписываем содержимое контейнера текстом ошибки
    resultContainer.innerHTML = `<p class="result__error" >${message}</p>`;
};

toggleModeBtn.addEventListener("click", toggleMode);

addMovieForm.addEventListener("submit", async (event) => {
    // отмена стандартного поведения формы (перезагрузка страницы)
    event.preventDefault();

    // собираем данные из полей формы (учиьывает только поля с атрибутом name)
    const formData = new FormData(addMovieForm);

    // конвертируем FormData в обычный JS-объект
    // (поскольку форма не содержит файлы,
    // можно сразу отправлять в JSON-формате)
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json" // явно указываем, что отправляем JSON
            },
            body: JSON.stringify(data) // превращаем объект в JSON-строку
        });

        // проверка статуса
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        // получение ответа от сервера
        const result = await response.json();
        console.log("Server Answer:", result);

        // рендерим информацию полученную от сервера
        renderResult(result);
        // очистка формы после успешной отправки
        addMovieForm.reset();

    } catch (error) {
        console.error(`Something went wrong: ${error}`);
        renderError(error.message);
    }
});

searchMovieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const movieId = document.querySelector("#search-id").value;

    try {
        const response = await fetch(`${apiUrl}/${movieId}`);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server Answer: ', response);

        renderResult(result);
        searchMovieForm.reset();

    } catch (error) {
        console.error(error);
        renderError(error.message);
    }

});

// Актуализация кол-ва отображаемых звёзд в рейтинге
// при изменении значения в input с типом range 
ratingInput.addEventListener("input", () => {
    ratingOutput.textContent = `${ratingInput.value} ⭐`;
});