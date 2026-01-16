// projecten-toggle.js
document.addEventListener("DOMContentLoaded", () => {
    const overviewLink = document.getElementById("overviewLink");
    const projectLinks = document.querySelectorAll(".project-link");
    const projects = document.querySelectorAll(".body-right .project");

    function showOverview() {
        projects.forEach(p => p.classList.remove("is-hidden"));
    }

    function showProjectById(id) {
        let found = false;

        projects.forEach(p => {
            const isMatch = p.id === id;
            p.classList.toggle("is-hidden", !isMatch);
            if (isMatch) found = true;
        });

        // als id niet bestaat: fallback naar overzicht
        if (!found) showOverview();
    }

    function handleHash() {
        const hash = window.location.hash.replace("#", "").trim();

        if (!hash || hash === "overzicht") {
            showOverview();
            return;
        }

        showProjectById(hash);
    }

    // Klik op "projecten" (titel) = overzicht
    if (overviewLink) {
        overviewLink.addEventListener("click", () => {
            // laat hash navigatie werken, maar zet zichtbaarheid meteen goed
            showOverview();
        });
    }

    // Klik op een project link = toon enkel dat project
    projectLinks.forEach(link => {
        link.addEventListener("click", () => {
            const target = link.dataset.target;
            if (target) showProjectById(target);
        });
    });

    // Bij back/forward of manueel hash aanpassen
    window.addEventListener("hashchange", handleHash);

    // Init bij page load
    handleHash();
});
