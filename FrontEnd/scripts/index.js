// Frontend/index.js

// Fonction pour récupérer les données depuis l'API
const getData = async (table) => {
    try {
        const response = await fetch(`http://localhost:5678/api/${table}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données (${table}):`, error);
        return [];
    }
};

// Fonction pour afficher les projets dans le DOM
const displayProjects = (projects) => {
    const gallery = document.getElementById("project-gallery");
    if (!gallery) {
        console.error("L'élément #project-gallery n'existe pas dans le HTML.");
        return;
    }

    gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les projets

    projects.forEach(project => {
        const projectCard = document.createElement("figure");
        projectCard.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
            <figcaption>${project.title}</figcaption>
        `;
        gallery.appendChild(projectCard);
    });
};

// Fonction pour créer les boutons de filtre
const createFilterButtons = (categories, allProjects) => {
    const filterContainer = document.getElementById("filter-buttons");
    if (!filterContainer) {
        console.error("L'élément #filter-buttons n'existe pas dans le HTML.");
        return;
    }

    // Style pour le conteneur des filtres
    filterContainer.style.margin = "0 0 50px 0";
    filterContainer.style.display = "flex";
    filterContainer.style.justifyContent = "center";
    filterContainer.style.gap = "10px";

    // Bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => {
        displayProjects(allProjects);
        setActiveFilter(allButton);
    });
    applyButtonStyle(allButton, true); // Actif par défaut
    filterContainer.appendChild(allButton);

    // Boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.addEventListener("click", () => {
            const filteredProjects = allProjects.filter(project => project.categoryId === category.id);
            displayProjects(filteredProjects);
            setActiveFilter(button);
        });
        applyButtonStyle(button, false);
        filterContainer.appendChild(button);
    });
};

// Fonction pour appliquer le style aux boutons de filtre
const applyButtonStyle = (button, isActive) => {
    button.style.padding = "10px 20px";
    button.style.border = "1px solid #1D6154";
    button.style.borderRadius = "20px";
    button.style.cursor = "pointer";
    button.style.fontFamily = "'Work Sans', sans-serif";
    button.style.fontSize = "16px";
    button.style.transition = "background-color 0.3s, color 0.3s";

    if (isActive) {
        button.style.backgroundColor = "#1D6154";
        button.style.color = "#FFFFFF";
    } else {
        button.style.backgroundColor = "#FFFFFF";
        button.style.color = "#1D6154";
    }
};

// Fonction pour marquer un filtre comme actif
const setActiveFilter = (activeButton) => {
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach(btn => applyButtonStyle(btn, false));
    applyButtonStyle(activeButton, true);
};

// Fonction pour configurer le bouton "Modifier"
const setupEditButton = () => {
    const editButtonContainer = document.getElementById("edit-button");
    const editButton = document.getElementById("edit-projects");
    if (!editButtonContainer || !editButton) {
        console.error("Les éléments #edit-button ou #edit-projects n'existent pas dans le HTML.");
        return;
    }

    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    console.log("Token trouvé dans localStorage :", token); // Log pour déboguer

    // Temporairement commenter la condition pour tester l'affichage
    // if (token) {
        editButtonContainer.style.display = "inline-block";
    // } else {
    //     editButtonContainer.style.display = "none";
    // }

    // Style pour le conteneur "portfolio-header"
    const portfolioHeader = document.querySelector(".portfolio-header");
    if (portfolioHeader) {
        portfolioHeader.style.display = "block"; // Revenir au comportement par défaut
        portfolioHeader.style.textAlign = "center"; // S'assurer que le titre est centré
        portfolioHeader.style.marginBottom = "30px";
    }

    // Style pour le bouton "Modifier"
    editButton.style.display = "flex";
    editButton.style.alignItems = "center";
    editButton.style.background = "none";
    editButton.style.border = "none";
    editButton.style.cursor = "pointer";
    editButton.style.fontFamily = "'Work Sans', sans-serif";
    editButton.style.fontSize = "14px";
    editButton.style.color = "#000";
    editButton.style.gap = "5px";
    editButton.style.marginTop = "10px"; // Espace sous "Mes Projets"

    // Style pour l'icône
    const editIcon = editButton.querySelector(".edit-icon");
    if (editIcon) {
        editIcon.style.width = "16px";
        editIcon.style.height = "16px";
    }

    // Action au clic sur le bouton "Modifier"
    editButton.addEventListener("click", () => {
        console.log("Bouton Modifier cliqué !");
        // À définir : que doit faire le bouton "Modifier" ?
    });
};

// Fonction principale pour initialiser la page
const init = async () => {
    try {
        const projects = await getData("works");
        const categories = await getData("categories");

        if (projects.length === 0 || categories.length === 0) {
            console.warn("Aucune donnée récupérée. Vérifie que l'API est en marche.");
            return;
        }

        displayProjects(projects);
        createFilterButtons(categories, projects);
        setupEditButton();
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
    }
};

// Appeler la fonction principale au chargement de la page
document.addEventListener("DOMContentLoaded", init);