// Frontend/index.js

// Fonction pour récupérer les données depuis l'API
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

// Affiche les projets
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

// Crée les boutons filtres
const createFilterButtons = (categories, allProjects) => {
    const container = document.getElementById("filter-buttons");
    if (!container) return;
    container.style.display = "none";
    container.style.justifyContent = "center";
    container.style.gap = "10px";
    container.style.marginBottom = "50px";

    const createBtn = (name, filterFn, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.classList.add("filter-btn");
        btn.addEventListener("click", () => {
            displayProjects(filterFn());
            setActiveFilter(btn);
        });
        applyButtonStyle(btn, active);
        container.appendChild(btn);
    };

    createBtn("Tous", () => allProjects, true);
    categories.forEach(cat => {
        createBtn(cat.name, () => allProjects.filter(p => p.categoryId === cat.id));
    });
};

// Style bouton actif
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

const setActiveFilter = (activeBtn) => {
    document.querySelectorAll(".filter-btn").forEach(btn => applyButtonStyle(btn, false));
    applyButtonStyle(activeBtn, true);
};

// Configure le bouton "modifier"
const setupEditButton = () => {
    const btnContainer = document.getElementById("edit-button");
    const editBtn = document.getElementById("edit-projects");
    const filters = document.getElementById("filter-buttons");
    const portfolioHeader = document.querySelector(".portfolio-header");
  
    if (!btnContainer || !editBtn || !filters || !portfolioHeader) return;
  
    // Mise en forme de l'en-tête "Mes projets" + bouton
    portfolioHeader.style.display = "flex";
    portfolioHeader.style.justifyContent = "center";
    portfolioHeader.style.alignItems = "center";
    portfolioHeader.style.gap = "10px";
    portfolioHeader.style.marginBottom = "50px";
  
    // Style du conteneur du bouton
    btnContainer.style.display = "flex";
  
    // Style du bouton "modifier"
    editBtn.style.display = "flex";
    editBtn.style.alignItems = "center";
    editBtn.style.background = "none";
    editBtn.style.border = "none";
    editBtn.style.cursor = "pointer";
    editBtn.style.fontFamily = "'Work Sans', sans-serif";
    editBtn.style.fontSize = "14px";
    editBtn.style.color = "#000";
    editBtn.style.gap = "5px";
  
    // Style de l'icône
    const icon = editBtn.querySelector(".edit-icon");
    if (icon) {
      icon.style.width = "16px";
      icon.style.height = "16px";
    }
  
    // Comportement : afficher/masquer les filtres, et cacher le bouton
    editBtn.addEventListener("click", () => {
      filters.style.display = filters.style.display === "flex" ? "none" : "flex";
      btnContainer.style.display = "none";
    });
  };

// Initialisation
document.addEventListener("DOMContentLoaded", async () => {
    const projects = await getData("works");
    const categories = await getData("categories");

    if (!projects.length || !categories.length) return;

    displayProjects(projects);
    createFilterButtons(categories, projects);
    setupEditButton();
});

document.addEventListener("DOMContentLoaded", () => {
    // Nettoie les liens de la nav
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
      link.style.textDecoration = "none";  // pas de souligné
      link.style.color = "black";          // couleur texte neutre
      link.style.fontWeight = "normal";    // normal pour tous
    });
  
    // Met en gras uniquement "login" si on est sur login.html
    const path = window.location.pathname;
    const loginLink = document.getElementById("nav-login");
  
    if (path.endsWith("login.html") && loginLink) {
      loginLink.style.fontWeight = "bold";
    }
  });