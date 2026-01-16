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



// =========================
// LIGHTBOX GALERIJ (2 galerijen mogelijk)
// =========================

function ensureLightbox() {
    let lb = document.getElementById("lightbox");
    if (lb) return lb;

    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.id = "lightbox";
    lb.innerHTML = `
    <div class="lightbox-top">
      <div class="lightbox-title" id="lightboxTitle">foto</div>
      <button class="lightbox-close" type="button" aria-label="Sluit">✕</button>
    </div>

    <div class="lightbox-stage">
      <button class="lightbox-nav js-prev" type="button" aria-label="Vorige">‹</button>

      <div class="lightbox-image-wrap">
        <img class="lightbox-image" id="lightboxImage" alt="">
      </div>

      <button class="lightbox-nav js-next" type="button" aria-label="Volgende">›</button>
    </div>

    <div class="lightbox-thumbs" id="lightboxThumbs" aria-label="Miniaturen"></div>
  `;
    document.body.appendChild(lb);
    return lb;
}

function initGalleries() {
    const lightbox = ensureLightbox();
    const imgEl = lightbox.querySelector("#lightboxImage");
    const thumbsEl = lightbox.querySelector("#lightboxThumbs");
    const titleEl = lightbox.querySelector("#lightboxTitle");
    const btnClose = lightbox.querySelector(".lightbox-close");
    const btnPrev = lightbox.querySelector(".js-prev");
    const btnNext = lightbox.querySelector(".js-next");

    let currentList = [];
    let currentIndex = 0;

    function openLightbox(list, index, title) {
        currentList = list;
        currentIndex = index;

        titleEl.textContent = title || "foto";
        lightbox.classList.add("is-open");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        render();
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    }

    function go(delta) {
        if (!currentList.length) return;
        currentIndex = (currentIndex + delta + currentList.length) % currentList.length;
        render();
    }

    function render() {
        const src = currentList[currentIndex];
        imgEl.src = src;
        imgEl.alt = `Foto ${currentIndex + 1}`;

        // thumbs
        thumbsEl.innerHTML = "";
        currentList.forEach((thumbSrc, i) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "lightbox-thumb" + (i === currentIndex ? " is-active" : "");
            b.setAttribute("aria-label", `Ga naar foto ${i + 1}`);
            b.innerHTML = `<img src="${thumbSrc}" alt="Miniatuur ${i + 1}" loading="lazy">`;
            b.addEventListener("click", () => {
                currentIndex = i;
                render();
            });
            thumbsEl.appendChild(b);
        });

        // zorg dat actieve miniatuur zichtbaar blijft
        const active = thumbsEl.querySelector(".lightbox-thumb.is-active");
        if (active) {
            active.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" });
        }
    }

    // Close handlers
    btnClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Nav handlers
    btnPrev.addEventListener("click", () => go(-1));
    btnNext.addEventListener("click", () => go(1));

    // Keyboard
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("is-open")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
    });

    // Bind elke galerij
    document.querySelectorAll(".js-gallery").forEach((galleryEl) => {
        const title = galleryEl.dataset.gallery === "bw" ? "zwart-wit" : "kleur";

        const buttons = Array.from(galleryEl.querySelectorAll(".photo-thumb"));
        const list = buttons.map(btn => btn.dataset.full || btn.querySelector("img")?.src).filter(Boolean);

        buttons.forEach((btn, index) => {
            btn.addEventListener("click", () => openLightbox(list, index, title));
        });
    });
}

// Zorg dat galleries initten nadat alles in DOM staat
initGalleries();


// =========================
// SCHETSBOEK GALERIJ (auto) – png/jpg/jpeg + skip missing
// =========================
const schetsboekGallery = document.getElementById("schetsboekGallery");

if (schetsboekGallery) {
    const totaal = 33;
    const exts = ["png", "jpg", "jpeg"];

    for (let i = 1; i <= totaal; i++) {
        const base = `afbeeldingen/schetsboek/schetsboek${i}`;

        const btn = document.createElement("button");
        btn.className = "photo-thumb";
        btn.type = "button";

        const img = document.createElement("img");
        img.alt = `Schetsboek pagina ${i}`;
        img.loading = "lazy";

        let extIndex = 0;

        function tryNextExt() {
            if (extIndex >= exts.length) {
                // niets gevonden -> verwijder knop zodat je geen broken icon ziet
                btn.remove();
                return;
            }
            const src = `${base}.${exts[extIndex++]}`;
            img.src = src;
            btn.dataset.full = src;
        }

        img.onerror = () => tryNextExt();

        btn.appendChild(img);
        schetsboekGallery.appendChild(btn);

        // start met png, daarna jpg, daarna jpeg
        tryNextExt();
    }
}

// BELANGRIJK: pas NA het genereren binden, anders geen lightbox nav/klik
initGalleries();

// =========================
// SCHETSBOEK GALERIJ (auto) – preload png/jpg/jpeg + lightbox correct
// =========================
(async function buildSchetsboekGallery() {
    const schetsboekGallery = document.getElementById("schetsboekGallery");

    // Als er geen schetsboekGallery is op deze view: gewoon galleries initten en klaar
    if (!schetsboekGallery) {
        initGalleries();
        return;
    }

    const totaal = 33;
    const exts = ["png", "jpg", "jpeg"];

    // probeersrc: preload zodat we zeker weten dat het bestand bestaat
    async function resolveSrc(base) {
        for (const ext of exts) {
            const src = `${base}.${ext}`;

            const ok = await new Promise((resolve) => {
                const testImg = new Image();
                testImg.onload = () => resolve(true);
                testImg.onerror = () => resolve(false);
                testImg.src = src;
            });

            if (ok) return src;
        }
        return null;
    }

    for (let i = 1; i <= totaal; i++) {
        const base = `afbeeldingen/schetsboek/schetsboek${i}`;
        const src = await resolveSrc(base);

        // bestaat niet → skip (geen broken icons)
        if (!src) continue;

        const btn = document.createElement("button");
        btn.className = "photo-thumb";
        btn.type = "button";
        btn.dataset.full = src;

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Schetsboek pagina ${i}`;
        img.loading = "lazy";

        btn.appendChild(img);
        schetsboekGallery.appendChild(btn);
    }

    // PAS NU: lightbox handlers + nav correct binden
    initGalleries();
})();
