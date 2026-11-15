// Функция переключения страниц
function showPage(pageId) {
    document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
    });

    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Загрузка новостей
async function loadNews() {
    const newsContainer = document.getElementById("news-list");
    if (!newsContainer) return;

    newsContainer.innerHTML = "<p style='color:#888;'>Сканирование сети...</p>";

    try {
        const response = await fetch(
            "https://api.github.com/repos/arsenulan16-ai/pixel-forge-site/contents/news"
        );

        if (!response.ok) throw new Error("Ошибка загрузки");

        const files = await response.json();
        const newsFiles = files.filter(file =>
            file.name.endsWith(".md") || file.name.endsWith(".json")
        );

        newsContainer.innerHTML = "";

        if (newsFiles.length === 0) {
            newsContainer.innerHTML = "<p style='color:#888;'>Данные отсутствуют.</p>";
            return;
        }

        // Берем последние 3 новости (чтобы не перегружать главную)
        for (const file of newsFiles.reverse().slice(0, 3)) {
            try {
                const fileResponse = await fetch(file.download_url);
                let article;
                
                if (file.name.endsWith('.json')) {
                    article = await fileResponse.json();
                } else {
                    const text = await fileResponse.text();
                    // Берем первую строку как заголовок для MD
                    const lines = text.split('\n');
                    article = { 
                        title: lines[0].replace('#', '').trim() || "Новость", 
                        date: "", 
                        text: lines.slice(1).join(' ').substring(0, 150) + "..." 
                    };
                }

                const card = document.createElement("div");
                card.className = "card";

                const title = document.createElement("h3");
                title.textContent = article.title || "Без названия";

                const date = document.createElement("p");
                date.textContent = article.date || "";
                date.style.color = "#ff00ff";

                const text = document.createElement("p");
                text.textContent = article.text || "";

                card.append(title, date, text);
                newsContainer.appendChild(card);
            } catch (e) {
                console.error("Ошибка в файле новости:", file.name, e);
            }
        }
    } catch (error) {
        newsContainer.innerHTML = "<p style='color:#ff00ff;'>СБОЙ СЕТИ. НЕ УДАЛОСЬ ЗАГРУЗИТЬ ДАННЫЕ.</p>";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadNews);
