// === 🏁 Fichier Frontend/index.js ===

// 🔐 Vérifie si l'utilisateur est connecté (token présent dans le localStorage)
const isConnected = !!localStorage.getItem("token");

// 🔄 Fonction générique pour récupérer les données de l'API (works ou categories)
const getData = async (table) => {
  try {
    const response = await fetch(`http://localhost:5678/api/${table}`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return await response.json(); // ✅ Renvoie les données si tout est OK
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des données (${table}):`, error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// 🖼️ Affiche les projets dynamiquement dans la galerie
const displayProjects = (projects) => {
  const gallery = document.getElementById("project-gallery");
  if (!gallery) return console.error("❌ #project-gallery introuvable");

  gallery.innerHTML = ""; // 🔁 On vide d'abord la galerie

  projects.forEach(project => {
    const card = document.createElement("figure");
    card.innerHTML = `
      <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
      <figcaption>${project.title}</figcaption>
    `;
    gallery.appendChild(card); // 🧱 On ajoute chaque projet dans la galerie
  });
};

// 🧰 Crée les boutons filtres à partir des catégories
const createFilterButtons = (categories, allProjects) => {
  const container = document.getElementById("filter-buttons");
  if (!container) return;

  container.classList.add("filter-buttons-container");

  // 🧱 Fonction interne pour créer un bouton
  const createBtn = (name, filterFn, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.classList.add("filter-btn");
    if (active) btn.classList.add("active");

    btn.addEventListener("click", () => {
      displayProjects(filterFn()); // 🔄 Filtrage dynamique
      setActiveFilter(btn); // ✅ Active visuellement le bon bouton
    });

    container.appendChild(btn);
  };

  createBtn("Tous", () => allProjects, true); // 🔘 Bouton "Tous"
  categories.forEach(cat => {
    createBtn(cat.name, () => allProjects.filter(p => p.categoryId === cat.id));
  });
};

// ✅ Met à jour visuellement le bouton de filtre sélectionné
const setActiveFilter = (activeBtn) => {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
};

// ✏️ Affiche le bouton "modifier" si connecté, et applique les classes nécessaires
const setupEditButton = () => {
  const btnContainer = document.getElementById("edit-button");
  const editBtn = document.getElementById("edit-projects");
  const filters = document.getElementById("filter-buttons");
  const portfolioHeader = document.querySelector(".portfolio-header");

  if (!btnContainer || !editBtn || !filters || !portfolioHeader) return;

  portfolioHeader.classList.add("portfolio-header"); // (au cas où ce ne serait pas appliqué)
};

// 🔓 Déconnecte l'utilisateur et redirige vers la page login
const logout = () => {
  localStorage.removeItem("token");
  window.location.reload(); // Recharger la page pour réinitialiser l'état
};

// 🚀 Code principal exécuté quand le DOM est prêt
document.addEventListener("DOMContentLoaded", async () => {
  const projects = await getData("works"); // Charge les projets
  const categories = await getData("categories"); // Charge les catégories

  if (!projects.length || !categories.length) return; // Si pas de projets ou catégories, on arrête l'exécution

  // 🧩 Gestion des éléments en fonction de l'état de connexion
  const adminBanner = document.getElementById("admin-banner");
  const btnContainer = document.getElementById("edit-button");
  const btnLogin = document.getElementById("nav-login");
  const btnLogout = document.getElementById("nav-logout");
  const btnLogout2 = document.getElementById("logout");

  btnLogout2.addEventListener("click", logout); // Gère le clic sur le bouton logout

  if (isConnected) {
    btnLogin.parentElement.style.display = "none"; // Cache le bouton login
    btnLogout.parentElement.style.display = "block"; // Affiche le bouton logout
  }

  if (!isConnected && adminBanner) {
    btnContainer.style.display = "none"; // ❌ Masque le bouton "modifier"
    adminBanner.style.display = "none";  // ❌ Masque la bannière admin
    createFilterButtons(categories, projects); // Affiche les boutons de filtre
  } else {
    setupEditButton(); // ✅ Active le bouton "modifier"
  }

  displayProjects(projects); // 🖼️ Charge les projets dans la galerie
});

// 💡 Affiche la modale quand on clique sur le bouton "modifier"
document.addEventListener("DOMContentLoaded", () => {
  const showModal = () => {
    const modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "block"; // 📂 Affiche la modale
    } else {
      console.error("❌ La modale n'a pas été trouvée dans le DOM.");
    }
  };

  const editBtn = document.getElementById("edit-projects");
  if (editBtn) {
    editBtn.addEventListener("click", showModal); // 🖱️ Clique sur "modifier" → affiche modale
  }
});
