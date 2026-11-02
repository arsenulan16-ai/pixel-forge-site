
function showPage(page) {
    document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");
    window.scrollTo(0, 0);
}

function unavailable() {
    alert("Ссылка на APK пока не добавлена.");
    return false;
}

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
        const newsFiles = files.filter(file =>
            file.name.endsWith(".md") || file.name.endsWith(".json")
        );

        newsContainer.innerHTML = "";

        for (const file of newsFiles.reverse()) {
            const fileResponse = await fetch(file.download_url);
            const article = await fileResponse.json();

            const card = document.createElement("div");
            card.className = "card";

            const title = document.createElement("h3");
            title.textContent = article.title || "Без названия";

            const date = document.createElement("p");
            date.textContent = article.date || "";

            const text = document.createElement("p");
            text.textContent = article.text || "";

            card.append(title, date, text);
            newsContainer.appendChild(card);
        }

        if (newsFiles.length === 0) {
            newsContainer.textContent = "Новостей пока нет.";
        }
    } catch (error) {
        newsContainer.textContent = "Не удалось загрузить новости.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadNews);

const gameVersions = [
    {
        version: "1.0",
        url: "https://drive.google.com/file/d/1nq1ZFomXZ_c93PTQdTsxhJvUdlCMFYBc/view?usp=drive_link"
    },
    {
        version: "1.2",
        url: "https://drive.google.com/file/d/1r0R8MQMxCwtRNo0x8FoASi70MUiTP7CJ/view?usp=sharing"
    }
];

let currentVersion = 0;

function changeVersion(direction) {
    currentVersion = Math.max(
        0,
        Math.min(gameVersions.length - 1, currentVersion + direction)
    );

    const game = gameVersions[currentVersion];
    const versionText = document.getElementById("game-version");
    const downloadButton = document.getElementById("game-download");

    versionText.textContent = game.version;

    if (game.url) {
        downloadButton.href = game.url;
        downloadButton.textContent = "📥 Скачать игру";
        downloadButton.style.pointerEvents = "auto";
        downloadButton.style.opacity = "1";
    } else {
        downloadButton.removeAttribute("href");
        downloadButton.textContent = "⏳ Версия 1.2 скоро выйдет";
        downloadButton.style.pointerEvents = "none";
        downloadButton.style.opacity = "0.5";
    }
}


