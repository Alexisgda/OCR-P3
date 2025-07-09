let allCatagories = []; // 🗂️ Stocke toutes les catégories
let allWorks = []; // 🖼️ Stocke tous les projets

const createWokModal = (project) => {
  const figure = document.createElement("figure");
  const modalGallery = document.querySelector(".modal-gallery");
  figure.dataset.id = project.id;
  figure.innerHTML = `
  <img src="${project.imageUrl}" alt="${project.title}">
  <i class="fa-solid fa-trash-can delete-icon" data-id="${project.id}"></i>
  `;
  modalGallery.appendChild(figure);  
}

const createWokIndex = (project) =>{
    const card = document.createElement("figure");
    const gallery = document.querySelector("#project-gallery");
    card.dataset.id = project.id;

    card.innerHTML = `
    <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
    <figcaption>${project.title}</figcaption>
    `;
    gallery.appendChild(card);
}

// 🔄 Fonction générique pour récupérer les données de l'API (works ou categories)
const getData = async (table) => {
  try {
    const response = await fetch(`http://localhost:5678/api/${table}`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const result = await response.json();
    if (table === "works") allWorks = result; // 🖼️ Stocke les projets
    if (table === "categories") allCategories = result; // 🗂️ Stocke les catégories
    return result; // ✅ Renvoie les données si tout est OK
  } catch (error) {
    console.error(
      `❌ Erreur lors de la récupération des données (${table}):`,
      error
    );
    return []; // Retourne un tableau vide en cas d'erreur
  }
};