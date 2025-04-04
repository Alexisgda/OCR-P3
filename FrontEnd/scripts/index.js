// Frontend/index.js
console.log("je suis un console log");

// Fonction pour récupérer les données depuis l'API
const getData = async (table) => {
    const response = await fetch("http://localhost:5678/api/" + table);
    const data = await response.json();
    console.log("🚀 ~ getData ~ data:", data);
    return data; // Retourne les données pour qu'on puisse les utiliser
};

getData("works")
getData("categories")

// Fonction pour afficher les projets dans le DOM
const displayProjects = (projects) => {
    const gallery = document.getElementById("project-gallery");
    if (!gallery) {
        console.error("L'élément #project-gallery n'existe pas dans le HTML.");
        return;
    }

    gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les projets
    console.warn(projects)

    projects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");

        // Suppose que l'API renvoie des champs comme "title", "description", "imageUrl" (à adapter selon la structure réelle)
        projectCard.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
            <h3>${project.title}</h3>
            <p>${project.description || "Pas de description disponible"}</p>
           
        `;

        gallery.appendChild(projectCard);
    });
};

// Fonction pour voir les détails d'un projet
const viewProject = (projectId) => {
    // Ici, on pourrait refaire une requête API pour les détails, mais pour simplifier, on affiche juste une alerte
    alert(`Détails du projet avec l'ID ${projectId}`);
    // Si tu veux utiliser les données déjà chargées, il faudra stocker "works" globalement (voir ci-dessous)
};

// Fonction principale pour charger et afficher les données
const init = async () => {
    try {
        const works = await getData("works"); // Récupère les projets
        // const categories = await getData("categories"); // Décommenter si tu veux utiliser les catégories plus tard
        displayProjects(works); // Affiche les projets
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
};

// Lance l'initialisation quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
    init();
});

// onclick="init()"