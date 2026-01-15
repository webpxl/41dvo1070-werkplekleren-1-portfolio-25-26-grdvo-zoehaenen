document.addEventListener("DOMContentLoaded", () => {
    const overviewView = document.getElementById("view-overview");
    const overviewLink = document.getElementById("js-overview-link");

    const detailViews = {
        scripting: document.getElementById("view-detail-scripting"),
        ui: document.getElementById("view-detail-ui"),
        fotografie: document.getElementById("view-detail-fotografie"),
        animatie: document.getElementById("view-detail-animatie"),
        schetsboek: document.getElementById("view-detail-schetsboek"),
    };

    function showOverview() {
        overviewView.classList.remove("is-hidden");
        Object.values(detailViews).forEach(v => v.classList.add("is-hidden"));
    }

    function showDetail(key) {
        const view = detailViews[key];
        if (!view) {
            showOverview();
            return;
        }
        overviewView.classList.add("is-hidden");
        Object.values(detailViews).forEach(v => v.classList.add("is-hidden"));
        view.classList.remove("is-hidden");

        // Optional: bovenaan beginnen (handig bij lange detailpagina’s)
        window.scrollTo({ top: 0, behavior: "instant" });
    }

    // 1) Klik op een OVERZICHT card (article) => detail
    document.querySelectorAll(".js-project-card").forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const key = card.dataset.project;
            showDetail(key);
            history.replaceState(null, "", `#${key}`);
        });
    });

    // 2) Klik op links in body-left => detail
    document.querySelectorAll(".js-open-detail").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const key = link.dataset.project;
            showDetail(key);
            history.replaceState(null, "", `#${key}`);
        });
    });

    // 3) Klik op "projecten" (body-left titel) => overzicht
    if (overviewLink) {
        overviewLink.addEventListener("click", (e) => {
            e.preventDefault();
            showOverview();
            history.replaceState(null, "", `#overzicht`);
            window.scrollTo({ top: 0, behavior: "instant" });
        });
    }

    // 4) Als je pagina laadt met een hash (#scripting) => direct detail openen
    const hash = (window.location.hash || "").replace("#", "").trim();
    if (hash && hash !== "overzicht") {
        showDetail(hash);
    } else {
        showOverview();
    }
});
