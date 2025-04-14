// Frontend/index.js
let isConnected = false
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

    // 🎨 Mise en forme du conteneur
    container.style.display = "none";
    container.style.justifyContent = "center";
    container.style.gap = "10px";
    container.style.marginBottom = "50px";

    // 🆗 Crée le bouton "Tous" qui affiche tous les projets
    const createBtn = (name, filterFn, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.classList.add("filter-btn");
        // btn.addEventListener("click", () => {
        //     displayProjects(filterFn()); // 🔄 Filtrage des projets
        //     setActiveFilter(btn); // ✅ Active visuellement le bouton
        // });
        displayProjects(filterFn()); // 🔄 Filtrage des projets
        setActiveFilter(btn); // ✅ Active visuellement le bouton
        applyButtonStyle(btn, active); // 🎨 Applique le style
        container.appendChild(btn);
    };

    createBtn("Tous", () => allProjects, true); // Premier bouton actif

    // ➕ Un bouton par catégorie
    categories.forEach(cat => {
        createBtn(cat.name, () => allProjects.filter(p => p.categoryId === cat.id));
    });
};

// 🎨 Applique le style à un bouton (actif ou pas)
const applyButtonStyle = (btn, active) => {
    btn.style.padding = "10px 20px";
    btn.style.border = "1px solid #1D6154";
    btn.style.borderRadius = "20px";
    btn.style.cursor = "pointer";
    btn.style.fontFamily = "'Work Sans', sans-serif";
    btn.style.fontSize = "16px";
    btn.style.transition = "background-color 0.3s, color 0.3s";
    btn.style.backgroundColor = active ? "#1D6154" : "#FFFFFF";
    btn.style.color = active ? "#FFFFFF" : "#1D6154";
};

// ✅ Active uniquement le bouton cliqué
const setActiveFilter = (activeBtn) => {
    document.querySelectorAll(".filter-btn").forEach(btn => applyButtonStyle(btn, false));
    applyButtonStyle(activeBtn, true);
};

// ✏️ Affiche le bouton "modifier" (si connecté), et gère son style + clic
const setupEditButton = () => {
    const btnContainer = document.getElementById("edit-button");
    const editBtn = document.getElementById("edit-projects");
    const filters = document.getElementById("filter-buttons");
    const portfolioHeader = document.querySelector(".portfolio-header");

    // 🧱 On s'assure que tous les éléments sont présents
    if (!btnContainer || !editBtn || !filters || !portfolioHeader) return;

    // 📐 Style général du bloc "Mes projets + bouton"
    portfolioHeader.style.display = "flex";
    portfolioHeader.style.justifyContent = "center";
    portfolioHeader.style.alignItems = "center";
    portfolioHeader.style.gap = "10px";
    portfolioHeader.style.marginBottom = "50px";

    // ✅ On affiche le bouton
    btnContainer.style.display = "flex";

   if(isConnected){
       editBtn.classList.add("show")
   }



    // 🖼️ Icône (si présente)
    const icon = editBtn.querySelector(".edit-icon");
    if (icon) {
        icon.style.width = "16px";
        icon.style.height = "16px";
    }

    // 🧩 Clic sur "modifier" : affiche/masque les filtres + cache le bouton
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

    displayProjects(projects);           // 🖼️ Affiche les projets
    createFilterButtons(categories, projects); // 🧰 Crée les filtres
    // setupEditButton();                   // ✏️ Affiche le bouton "modifier"
});

// 🎯 Met "login" en gras si on est sur login.html
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");

    // Nettoyage du style de base des liens
    navLinks.forEach(link => {
        link.style.textDecoration = "none";
        link.style.color = "black";
        link.style.fontWeight = "normal";
    });

    // Si on est sur login.html → mettre "login" en gras
    const path = window.location.pathname;
    const loginLink = document.getElementById("nav-login");
    if (path.endsWith("login.html") && loginLink) {
        loginLink.style.fontWeight = "bold";
    }
});
