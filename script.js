// Функция переключения страниц
function showPage(pageId) {
    // Скрываем все секции
    document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
    });

    // Показываем нужную
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
    }

    // Прокрутка наверх
    window.scrollTo(0, 0);
}

// Загрузка новостей (оставил как было, но с защитой от ошибок)
async function loadNews() {
    const newsContainer = document.getElementById("news-list");
    if (!newsContainer) return;

    newsContainer.textContent = "Загрузка новостей...";

    try {
        const response = await fetch(
            "https://api.github.com/repos/arsenulan16-ai/pixel-forge-site/contents/news"
        );

        if (!response.ok) throw new Error("Ошибка загрузки");

        const files = await response.json();
        // Фильтруем только .md и .json
        const newsFiles = files.filter(file =>
            file.name.endsWith(".md") || file.name.endsWith(".json")
        );

        newsContainer.innerHTML = "";

        if (newsFiles.length === 0) {
            newsContainer.textContent = "Новостей пока нет.";
            return;
        }

        // Проходимся по файлам
        for (const file of newsFiles.reverse()) {
            try {
                const fileResponse = await fetch(file.download_url);
                let article;
                
                // Если это JSON, парсим. Если MD (просто текст), оборачиваем в объект.
                if (file.name.endsWith('.json')) {
                    article = await fileResponse.json();
                } else {
                    const text = await fileResponse.text();
                    article = { title: "Новость", date: "", text: text };
                }

                const card = document.createElement("div");
                card.className = "card";

                const title = document.createElement("h3");
                title.textContent = article.title || "Без названия";

                const date = document.createElement("p");
                date.textContent = article.date || "";
                date.style.color = "#ff66cc";

                const text = document.createElement("p");
                text.textContent = article.text || "";

                card.append(title, date, text);
                newsContainer.appendChild(card);
            } catch (e) {
                console.error("Ошибка в файле новости:", file.name, e);
            }
        }
    } catch (error) {
        newsContainer.textContent = "Не удалось загрузить новости.";
        console.error(error);
    }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadNews();
});
