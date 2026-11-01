
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
