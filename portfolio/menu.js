const header = document.getElementById("siteHeader");
const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

function closeMenu() {
    header.classList.remove("menu-open");
    burgerBtn.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    const isOpen = header.classList.toggle("menu-open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
}

burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
});

/* Klik buiten menu = sluiten */
document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeMenu();
});

/* ESC = sluiten */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
});

/* Optioneel: klik op een item = sluiten */
mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a.mobile-item");
    if (link) closeMenu();
});

