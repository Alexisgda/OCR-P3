// === 🖼️ MODALE : ouverture / fermeture ===

// 🔓 Ouvre la modale et charge les images
const openModal = () => {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.style.display = "flex"; // Affiche la modale
    loadModalGallery(); // Charge les images dans la galerie
  }
};

// 🔒 Ferme la modale
const closeModal = () => {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    // Réinitialise la modale pour revenir à la galerie
    const addPhotoBtn = document.querySelector(".modal-add-btn"); // Bouton "Ajouter une photo"
    const modalGallery = document.querySelector(".modal-gallery"); // Galerie des projets
    const addPhotoForm = document.getElementById("add-photo-form"); // Formulaire d’ajout
    addPhotoForm.reset(); // Réinitialise le formulaire
    addPhotoForm.style.display = "none"; // Cache le formulaire
    modalGallery.style.display = "grid"; // Affiche la galerie
    addPhotoBtn.style.display = "block"; // Affiche le bouton "Ajouter une photo"

    overlay.style.display = "none"; // Ferme la modale
  }
};

// ⚙️ Initialisation après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-projects"); // Bouton "Modifier"
  const modalOverlay = document.getElementById("modal-overlay"); // Fond de la modale
  const closeBtn = document.querySelector(".modal-close"); // Bouton de fermeture (croix)

  if (editBtn) editBtn.addEventListener("click", openModal); // Ouvre la modale au clic
  if (closeBtn) closeBtn.addEventListener("click", closeModal); // Ferme la modale au clic

  // Ferme la modale si on clique en dehors du contenu
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      const modal = document.getElementById("modal");
      if (!modal.contains(e.target)) {
        closeModal();
      }
    });
  }
});

// 📸 Charge les projets depuis l’API et les affiche dans la galerie
const loadModalGallery = async () => {
  const modalGallery = document.querySelector(".modal-gallery");
  if (!modalGallery) return;

  modalGallery.innerHTML = ""; // Vide la galerie avant affichage

  try {
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();

    // Crée un élément figure pour chaque projet
    projects.forEach((project) => {
      const figure = document.createElement("figure");
      figure.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <i class="fa-solid fa-trash-can delete-icon" data-id="${project.id}"></i>
      `;
      modalGallery.appendChild(figure);
    });

    // Gère la suppression au clic sur l'icône corbeille
    const deleteIcons = modalGallery.querySelectorAll(".delete-icon");

    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const projectId = e.currentTarget.dataset.id;

        try {
          const response = await fetch(
            `http://localhost:5678/api/works/${projectId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            loadModalGallery(); // Recharge la galerie après suppression
            displayProjects(await getData("works")); // Recharge la page principale
          } else {
            console.warn("❌ Échec suppression :", response.status);
          }
        } catch (error) {
          console.error("💥 Erreur suppression :", error);
        }
      });
    });
  } catch (error) {
    console.error("❌ Erreur chargement images :", error);
  }
};

// === ➕ MODALE : AJOUT D’UNE PHOTO ===
document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments HTML
  const addPhotoBtn = document.querySelector(".modal-add-btn");
  const modalGallery = document.querySelector(".modal-gallery");
  const addPhotoForm = document.getElementById("add-photo-form");
  const photoInput = document.getElementById("photo");
  const imageAjout = document.getElementById("image-ajout");
  const imagePreview = document.getElementById("image-preview");
  const returnBtn = document.getElementById("return-to-gallery");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitBtn = document.getElementById("submit-button");
  const imageError = document.getElementById("image-error");
  const hr = document.getElementById('modal-separator');

  // Affiche le formulaire d’ajout de photo
  if (addPhotoBtn && addPhotoForm && modalGallery) {
    addPhotoBtn.addEventListener("click", async () => {
      modalGallery.style.display = "none";
      addPhotoForm.style.display = "flex";
      addPhotoBtn.style.display = "none";
      hr.style.display = 'none';

      // Modifie le titre de la modale
      const titleElement = document.querySelector(".modal-title");
      titleElement.textContent = "Ajouter une photo";

      // Charge les catégories dynamiquement si vide
      if (categorySelect && categorySelect.children.length === 0) {
        try {
          const res = await fetch("http://localhost:5678/api/categories");
          const categories = await res.json();

          categories.forEach((cat) => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
          });
        } catch (error) {
          console.error("❌ Erreur chargement catégories :", error);
        }
      }
    });
  }

  // Gère le retour à la galerie
  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      addPhotoForm.style.display = "none";
      modalGallery.style.display = "grid";
      addPhotoBtn.style.display = "block";
      hr.style.display = 'block';
      addPhotoForm.reset(); // Réinitialise le formulaire

      if (submitBtn) submitBtn.disabled = true;

      // Remet le titre par défaut
      const titleElement = document.querySelector(".modal-title");
      titleElement.textContent = "Galerie photo";
      loadModalGallery(); // Recharge la galerie
    });
  }

  // Affiche un aperçu de l’image sélectionnée
  if (photoInput && imagePreview) {
    photoInput.addEventListener("change", () => {
      const file = photoInput.files[0];
      if (!file) return;

      // Vérifie la taille du fichier
      if (file.size > 4194304) {
        imagePreview.style.display = 'none';
        imageAjout.style.display = 'flex';
        imageError.style.display = 'block';
        return;
      } else {
        imageError.style.display = 'none';
      }

      // Affiche l’aperçu avec FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 30%">`;
      };
      reader.readAsDataURL(file);
      imagePreview.style.display = 'flex';
      imageAjout.style.display = 'none';
    });
  }

  // Active le bouton "Valider" si tous les champs sont remplis
  const checkFormValidity = () => {
    const isImageSelected = photoInput && photoInput.files.length > 0;
    const isTitleFilled = titleInput && titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect && categorySelect.value !== "";

    if (submitBtn) {
      submitBtn.disabled = !(
        isImageSelected &&
        isTitleFilled &&
        isCategorySelected
      );
    }
  };

  // Surveille les changements pour activer/désactiver le bouton
  if (photoInput) photoInput.addEventListener("change", checkFormValidity);
  if (titleInput) titleInput.addEventListener("input", checkFormValidity);
  if (categorySelect)
    categorySelect.addEventListener("change", checkFormValidity);

  // Envoie le formulaire à l’API
  if (addPhotoForm) {
    addPhotoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (
        !photoInput.files.length ||
        !titleInput.value ||
        !categorySelect.value
      ) {
        alert("Tous les champs sont obligatoires.");
        return;
      }

      const formData = new FormData();
      formData.append("image", photoInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", categorySelect.value);

      try {
        const res = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (res.ok) {
          console.log("✅ Projet ajouté !");
          addPhotoForm.reset();
          imagePreview.style.display = 'none';
          imageAjout.style.display = 'flex';

          checkFormValidity();

          // Le projet est bien ajouté côté serveur
          let newProjet = await res.json();
          console.log('mon nouveau projet :', newProjet);
        } else {
          alert("Erreur lors de l'ajout.");
        }
      } catch (error) {
        console.error("💥 Erreur lors de l'envoi :", error);
      }
    });
  }
});
