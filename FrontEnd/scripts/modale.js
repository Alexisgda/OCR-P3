// === 🖼️ MODALE : ouverture / fermeture ===

// 🔓 Ouvre la modale et charge les images
const openModal = () => {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.style.display = "flex";        // 🎯 Affiche la modale
      loadModalGallery();                    // 📥 Charge la galerie dynamique
    }
};

// 🔒 Ferme la modale
const closeModal = () => {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) overlay.style.display = "none";
};

// ⚙️ Initialisation après chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("edit-projects");       // ✏️ bouton "modifier"
    const modalOverlay = document.getElementById("modal-overlay");  // 🌫️ fond gris
    const closeBtn = document.querySelector(".modal-close");        // ❌ bouton croix

    if (editBtn) editBtn.addEventListener("click", openModal);      // ▶️ Ouvrir modale
    if (closeBtn) closeBtn.addEventListener("click", closeModal);   // ❎ Fermer modale

    // 🖱️ Fermer modale si clic à l’extérieur de #modal
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            const modal = document.getElementById("modal");
            if (!modal.contains(e.target)) {
                closeModal();
            }
        });
    }
});

// 📸 Charge et affiche les projets dans la modale
const loadModalGallery = async () => {
    const modalGallery = document.querySelector(".modal-gallery");
    if (!modalGallery) return;

    modalGallery.innerHTML = ""; // 🔄 Nettoyage avant affichage

    try {
        // 🌐 Appel API
        const response = await fetch("http://localhost:5678/api/works");
        const projects = await response.json();

        // 🔁 Création des blocs <figure> avec img + corbeille
        projects.forEach(project => {
            const figure = document.createElement("figure");
            figure.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <i class="fa-solid fa-trash-can delete-icon" data-id="${project.id}"></i>
            `;
            modalGallery.appendChild(figure);
        });

        // 🗑️ Gestion du clic sur les icônes corbeille
        const deleteIcons = modalGallery.querySelectorAll(".delete-icon");

        deleteIcons.forEach(icon => {
            icon.addEventListener("click", async (e) => {
                e.preventDefault();               // ✅ Stop reload
                e.stopImmediatePropagation();     // ✅ Stop propagation

                const projectId = e.currentTarget.dataset.id;

                try {
                    const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json"
                        },
                    });

                    if (response.ok) {
                        loadModalGallery();  // 🔄 Recharge la modale
                        displayProjects(await getData("works")); // 🔄 Recharge la page
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
    // 📌 Sélecteurs principaux
    const addPhotoBtn = document.querySelector(".modal-add-btn");          // ➕ Bouton "Ajouter une photo"
    const modalGallery = document.querySelector(".modal-gallery");         // 🖼️ Galerie des projets
    const addPhotoForm = document.getElementById("add-photo-form");        // 📄 Formulaire
    const photoInput = document.getElementById("photo");                   // 📎 Champ fichier image
    const imagePreview = document.getElementById("image-preview");         // 🖼️ Bloc preview image
    const returnBtn = document.getElementById("return-to-gallery");        // 🔙 Bouton retour
    const titleInput = document.getElementById("title");                   // 📝 Titre du projet
    const categorySelect = document.getElementById("category");            // 📂 Catégories
    const submitBtn = document.getElementById("submit-button");            // ✅ Bouton "Valider"

    // 🔄 Affiche le formulaire d’ajout
    if (addPhotoBtn && addPhotoForm && modalGallery) {
        addPhotoBtn.addEventListener("click", async () => {
            modalGallery.style.display = "none";
            addPhotoForm.style.display = "flex";
            addPhotoBtn.style.display = "none"

            // Change le titre de la modale à "Ajouter une photo"
            const titleElement = document.querySelector('.modal-title');
            titleElement.textContent = "Ajouter une photo";  // Changer le titre ici

            // 📂 Charge dynamiquement les catégories si non chargées
            if (categorySelect && categorySelect.children.length === 0) {
                try {
                    const res = await fetch("http://localhost:5678/api/categories");
                    const categories = await res.json();

                    categories.forEach(cat => {
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

    // 🔙 Retour à la galerie
    if (returnBtn) {
        returnBtn.addEventListener("click", () => {
            addPhotoForm.style.display = "none";
            modalGallery.style.display = "grid";
            addPhotoBtn.style.display = "block";
            addPhotoForm.reset();

            // 🧽 Réinitialise l’aperçu image
            if (imagePreview) {
                imagePreview.innerHTML = `
                    <i class="fa-regular fa-image"></i>
                    <label for="photo" class="upload-label">+ Ajouter photo</label>
                    <input type="file" id="photo" name="image" accept="image/*" hidden required>
                    <span class="upload-info">jpg, png : 4mo max</span>
                `;
            }

            // 🔁 Désactive le bouton "Valider" au retour
            if (submitBtn) submitBtn.disabled = true;

            // Remet le titre à "Galerie photo"
            const titleElement = document.querySelector('.modal-title');
            titleElement.textContent = "Galerie photo";  // Remettre le titre ici
        });
    }

    // 🖼️ Preview dynamique de l’image
    if (photoInput && imagePreview) {
        photoInput.addEventListener("change", () => {
            const file = photoInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        });
    }

    // ✅ Activation dynamique du bouton "Valider"
    const checkFormValidity = () => {
        const isImageSelected = photoInput && photoInput.files.length > 0;
        const isTitleFilled = titleInput && titleInput.value.trim() !== "";
        const isCategorySelected = categorySelect && categorySelect.value !== "";

        if (submitBtn) {
            submitBtn.disabled = !(isImageSelected && isTitleFilled && isCategorySelected);
        }
    };

    if (photoInput) photoInput.addEventListener("change", checkFormValidity);
    if (titleInput) titleInput.addEventListener("input", checkFormValidity);
    if (categorySelect) categorySelect.addEventListener("change", checkFormValidity);

    // 📤 Envoi du formulaire à l’API
    if (addPhotoForm) {
        addPhotoForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!photoInput.files.length || !titleInput.value || !categorySelect.value) {
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
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                });

                if (res.ok) {
                    console.log("✅ Projet ajouté !");
                    addPhotoForm.reset();
                    addPhotoForm.style.display = "none";
                    modalGallery.style.display = "grid";
                    addPhotoBtn.style.display = "block";

                    loadModalGallery(); // 🔄 Recharge la modale
                    displayProjects(await getData("works")); // 🔄 Recharge la page
                } else {
                    alert("Erreur lors de l'ajout.");
                }

            } catch (error) {
                console.error("💥 Erreur lors de l'envoi :", error);
            }
        });
    }
});
