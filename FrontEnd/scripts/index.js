// Frontend/index.js

// 🔐 Vérifie si l'utilisateur est connecté
const isConnected = !!localStorage.getItem("token");

// 🔄 Fonction qui va chercher les données depuis l'API (works ou categories)
const getData = async (table) => {
    try {
        const response = await fetch(`http://localhost:5678/api/${table}`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la récupération des données (${table}):`, error);
        return [];
    }
};

// 🖼️ Affiche les projets dans la galerie
const displayProjects = (projects) => {
    const gallery = document.getElementById("project-gallery");
    if (!gallery) return console.error("#project-gallery introuvable");
    gallery.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("figure");
        card.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
            <figcaption>${project.title}</figcaption>
        `;
        gallery.appendChild(card);
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
  
    portfolioHeader.classList.add("portfolio-header");

    // Affiche la bannière "Mode édition" si connecté
    if (isConnected) {
      const banner = document.getElementById("edition-banner");
      if (banner) banner.style.display = "block";
    }
  
  
    if (isConnected) {
      // ✅ Connecté : on montre "modifier", on cache les filtres
      btnContainer.style.display = "flex";
      filters.style.display = "none";
  
      // ⛔ NE MET RIEN ICI ! PAS DE CLICK POUR FAIRE APPARAÎTRE LES FILTRES
    } else {
      // ❌ Pas connecté : "modifier" caché, filtres visibles
      btnContainer.style.display = "none";
      filters.style.display = "flex";
    }
  };
  
  

// 🚀 Lancement du script une fois le DOM chargé
document.addEventListener("DOMContentLoaded", async () => {
    const projects = await getData("works");
    const categories = await getData("categories");
  
    if (!projects.length || !categories.length) return;
  
    displayProjects(projects);
    createFilterButtons(categories, projects);
    setupEditButton(); // Important ici
  });
  

// 🎯 Met "login" en gras si on est sur login.html
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => link.classList.remove("active-link"));

    const path = window.location.pathname;
    const loginLink = document.getElementById("nav-login");
    if (path.endsWith("login.html") && loginLink) {
        loginLink.classList.add("active-link");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Sélectionne l'élément de la bannière admin
    const adminBanner = document.getElementById("admin-banner");
  
    // Récupère le token dans le localStorage pour savoir si l'utilisateur est connecté
    const token = localStorage.getItem("token");
  
    // Si le token n'existe pas (l'utilisateur n'est pas connecté) et que la bannière existe
    if (!token && adminBanner) {
      // Cache la bannière (Mode édition) si l'utilisateur n'est pas connecté
      adminBanner.style.display = "none";
    }
  });
  