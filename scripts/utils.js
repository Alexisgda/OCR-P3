const createWokModal = (project) => {
  const figure = document.createElement("figure");
  const modalGallery = document.querySelector(".modal-gallery");
  figure.innerHTML = `
  <img src="${project.imageUrl}" alt="${project.title}">
  <i class="fa-solid fa-trash-can delete-icon" data-id="${project.id}"></i>
  `;
  modalGallery.appendChild(figure);  
}

const createWokIndex = (project) =>{
    const card = document.createElement("figure");
    const gallery = document.querySelector("#project-gallery");
    card.innerHTML = `
    <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
    <figcaption>${project.title}</figcaption>
    `;
    gallery.appendChild(card);
}