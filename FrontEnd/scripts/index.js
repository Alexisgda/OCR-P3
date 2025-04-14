// Frontend/index.js
let isConnected = false;

// 🔄 Fonction qui va chercher les données depuis l'API (works ou categories)
const getData = async (table) => {
    try {
        const response = await fetch(`http://localhost:5678/api/${table}`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json(); // ↩️ On retourne les données
    } catch (error) {
        console.error(`Erreur lors de la récupération des données (${table}):`, error);
        return []; // 🔁 Si erreur, on renvoie un tableau vide
    }
};

// 🖼️ Affiche les projets dans la galerie
const displayProjects = (projects) => {
    const gallery = document.getElementById("project-gallery");
    if (!gallery) return console.error("#project-gallery introuvable");

    gallery.innerHTML = ""; // 🧽 On vide d'abord la galerie

    projects.forEach(project => {
        const card = document.createElement("figure");
        card.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
            <figcaption>${project.title}</figcaption>
        `;
        gallery.appendChild(card); // ➕ On ajoute chaque projet à la galerie
    });
};

// 🧰 Crée les boutons de filtres à partir des catégories
const createFilterButtons = (categories, allProjects) => {
    const container = document.getElementById("filter-buttons");
    if (!container) return;

    container.classList.add("filter-buttons-container");

    const createBtn = (name, filterFn, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.classList.add("filter-btn");
        if (active) btn.classList.add("active");
        btn.addEventListener("click", () => {
            displayProjects(filterFn());
            setActiveFilter(btn);
        });
        container.appendChild(btn);
    };

    createBtn("Tous", () => allProjects, true);

    categories.forEach(cat => {
        createBtn(cat.name, () => allProjects.filter(p => p.categoryId === cat.id));
    });
};

// ✅ Active uniquement le bouton cliqué
const setActiveFilter = (activeBtn) => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
};

// ✏️ Affiche le bouton "modifier" (si connecté), et gère son style + clic
const setupEditButton = () => {
    const btnContainer = document.getElementById("edit-button");
    const editBtn = document.getElementById("edit-projects");
    const filters = document.getElementById("filter-buttons");
    const portfolioHeader = document.querySelector(".portfolio-header");

    if (!btnContainer || !editBtn || !filters || !portfolioHeader) return;

    portfolioHeader.classList.add("portfolio-header-layout");
    btnContainer.style.display = "flex";

    if (isConnected) {
        editBtn.classList.add("show");
    }

    editBtn.addEventListener("click", () => {
        filters.style.display = filters.style.display === "flex" ? "none" : "flex";
        btnContainer.style.display = "none";
    });
};

// 🚀 Lancement du script une fois le DOM chargé
document.addEventListener("DOMContentLoaded", async () => {
    const projects = await getData("works");
    const categories = await getData("categories");

    if (!projects.length || !categories.length) return;

    displayProjects(projects);
    createFilterButtons(categories, projects);
    // setupEditButton();
});

// 🎯 Met "login" en gras si on est sur login.html
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.classList.remove("active-link");
    });

    const path = window.location.pathname;
    const loginLink = document.getElementById("nav-login");
    if (path.endsWith("login.html") && loginLink) {
        loginLink.classList.add("active-link");
    }
});