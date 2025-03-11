let images = JSON.parse(localStorage.getItem('galleryImages')) || [...initialImages];

function saveImagesToLocalStorage() {
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

const gallery = document.getElementById("gallery");
const form = document.getElementById("image-form");
const navItems = document.querySelectorAll(".nav-item");
const gallerySection = document.getElementById("gallery-section");
const tagsSection = document.getElementById("tags-section");
const tagsList = document.getElementById("tags-list");
const tagGallery = document.getElementById("tag-gallery");
const addFormOverlay = document.getElementById("add-form-overlay");
const editFormOverlay = document.getElementById("edit-form-overlay");
const mobileSearchOverlay = document.getElementById("mobile-search-overlay");
const closeBtnAdd = document.querySelector(".add-form .close-btn");
const closeBtnEdit = document.querySelector(".edit-form .close-btn");
const closeSearchBtn = document.querySelector(".close-search-btn");
const tagInput = document.getElementById("tag-input");
const addTagBtn = document.getElementById("add-tag-btn");
const tagsDisplay = document.getElementById("tags-display");
const editTagInput = document.getElementById("edit-tag-input");
const editAddTagBtn = document.getElementById("edit-add-tag-btn");
const editTagsDisplay = document.getElementById("edit-tags-display");
const searchInput = document.getElementById("search-input");
const mobileSearchIcon = document.querySelector(".mobile-search-icon");
const mobileSearchInput = document.getElementById("mobile-search-input");
const mobileSearchBtn = document.getElementById("mobile-search-btn");
const editForm = document.getElementById("edit-image-form");
const deleteImageBtn = document.getElementById("delete-image-btn"); // Новая кнопка удаления

let currentTags = [];
let editTags = [];
let currentEditIndex = null;
let currentMobileSearchQuery = "";

function createCard(image, index) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.innerHTML = `
        <img src="${image.url}" alt="${image.title}">
        <div class="card-content">
            <h3>${image.title}</h3>
            <p>${image.description}</p>
            <div class="tags">
                ${image.tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join("")}
            </div>
        </div>
    `;
    return card;
}

function displayGallery(filter = null, searchQuery = "") {
    const currentCards = document.querySelectorAll(".card");
    currentCards.forEach(card => {
        card.classList.remove("visible");
        card.classList.add("hidden");
    });

    setTimeout(() => {
        gallery.innerHTML = "";
        let filteredImages = filter ? images.filter(img => img.tags.includes(filter)) : images;

        if (searchQuery) {
            filteredImages = filteredImages.filter(img =>
                img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        filteredImages.forEach((image, index) => {
            const card = createCard(image, images.indexOf(image));
            gallery.appendChild(card);
            setTimeout(() => {
                card.classList.add("visible");
            }, index * 100);
        });
    }, 500);
}

function displayTags() {
    tagsList.innerHTML = "";
    tagGallery.innerHTML = "";
    const allTags = [...new Set(images.flatMap(img => img.tags))];

    allTags.forEach(tag => {
        const tagItem = document.createElement("div");
        tagItem.classList.add("tag-item");
        tagItem.textContent = tag;
        tagItem.dataset.tag = tag;
        tagsList.appendChild(tagItem);

        tagItem.addEventListener("click", () => {
            const currentCards = tagGallery.querySelectorAll(".card");
            currentCards.forEach(card => {
                card.classList.remove("visible");
                card.classList.add("hidden");
            });

            setTimeout(() => {
                tagGallery.innerHTML = "";
                const tagImages = images.filter(img => img.tags.includes(tag));
                tagImages.forEach((image, index) => {
                    const card = createCard(image, images.indexOf(image));
                    tagGallery.appendChild(card);
                    setTimeout(() => {
                        card.classList.add("visible");
                    }, index * 100);
                });
            }, 500);
        });
    });
}

displayGallery();

navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        const action = item.dataset.action;

        if (section === "gallery") {
            gallerySection.classList.add("active");
            tagsSection.classList.remove("active");
            addFormOverlay.classList.remove("active");
            editFormOverlay.classList.remove("active");
            mobileSearchOverlay.classList.remove("active");
            displayGallery(null, searchInput.value || currentMobileSearchQuery);
        } else if (section === "tags") {
            gallerySection.classList.remove("active");
            tagsSection.classList.add("active");
            addFormOverlay.classList.remove("active");
            editFormOverlay.classList.remove("active");
            mobileSearchOverlay.classList.remove("active");
            displayTags();
        } else if (action === "add-image") {
            addFormOverlay.classList.add("active");
            editFormOverlay.classList.remove("active");
            mobileSearchOverlay.classList.remove("active");
        }
    });
});

closeBtnAdd.addEventListener("click", () => {
    addFormOverlay.classList.remove("active");
    form.reset();
    tagsDisplay.innerHTML = "";
    currentTags = [];
});

addFormOverlay.addEventListener("click", (e) => {
    if (e.target === addFormOverlay) {
        addFormOverlay.classList.remove("active");
        form.reset();
        tagsDisplay.innerHTML = "";
        currentTags = [];
    }
});

closeBtnEdit.addEventListener("click", () => {
    editFormOverlay.classList.remove("active");
    editForm.reset();
    editTagsDisplay.innerHTML = "";
    editTags = [];
});

editFormOverlay.addEventListener("click", (e) => {
    if (e.target === editFormOverlay) {
        editFormOverlay.classList.remove("active");
        editForm.reset();
        editTagsDisplay.innerHTML = "";
        editTags = [];
    }
});

function closeMobileSearchOverlay() {
    mobileSearchOverlay.classList.remove("active");
    currentMobileSearchQuery = mobileSearchInput.value;
    displayGallery(null, currentMobileSearchQuery);
}

closeSearchBtn.addEventListener("click", closeMobileSearchOverlay);

mobileSearchOverlay.addEventListener("click", (e) => {
    if (e.target === mobileSearchOverlay) {
        closeMobileSearchOverlay();
    }
});

addTagBtn.addEventListener("click", () => {
    const tagValue = tagInput.value.trim();
    if (tagValue && !currentTags.includes(tagValue)) {
        currentTags.push(tagValue);
        const tagElement = document.createElement("div");
        tagElement.classList.add("tag-item-display");
        tagElement.innerHTML = `${tagValue} <span class="remove-tag">×</span>`;
        tagsDisplay.appendChild(tagElement);

        tagElement.querySelector(".remove-tag").addEventListener("click", () => {
            currentTags = currentTags.filter(t => t !== tagValue);
            tagElement.remove();
        });
        tagInput.value = "";
    }
});

editAddTagBtn.addEventListener("click", () => {
    const tagValue = editTagInput.value.trim();
    if (tagValue && !editTags.includes(tagValue)) {
        editTags.push(tagValue);
        const tagElement = document.createElement("div");
        tagElement.classList.add("tag-item-display");
        tagElement.innerHTML = `${tagValue} <span class="remove-tag">×</span>`;
        editTagsDisplay.appendChild(tagElement);

        tagElement.querySelector(".remove-tag").addEventListener("click", () => {
            editTags = editTags.filter(t => t !== tagValue);
            tagElement.remove();
        });
        editTagInput.value = "";
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentTags.length === 0) {
        alert("Добавьте хотя бы один тег!");
        return;
    }

    const newImage = {
        url: document.getElementById("image-url").value,
        title: document.getElementById("image-title").value,
        description: document.getElementById("image-desc").value,
        tags: [...currentTags]
    };
    images.push(newImage);
    saveImagesToLocalStorage();
    displayGallery(null, searchInput.value || currentMobileSearchQuery);
    displayTags();
    addFormOverlay.classList.remove("active");
    form.reset();
    tagsDisplay.innerHTML = "";
    currentTags = [];
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (editTags.length === 0) {
        alert("Добавьте хотя бы один тег!");
        return;
    }

    const editedImage = {
        url: document.getElementById("edit-image-url").value,
        title: document.getElementById("edit-image-title").value,
        description: document.getElementById("edit-image-desc").value,
        tags: [...editTags]
    };

    images[currentEditIndex] = editedImage;
    saveImagesToLocalStorage();
    displayGallery(null, searchInput.value || currentMobileSearchQuery);
    displayTags();
    editFormOverlay.classList.remove("active");
    editForm.reset();
    editTagsDisplay.innerHTML = "";
    editTags = [];
});

deleteImageBtn.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите удалить это фото?")) {
        images.splice(currentEditIndex, 1);
        saveImagesToLocalStorage();
        displayGallery(null, searchInput.value || currentMobileSearchQuery);
        displayTags();
        editFormOverlay.classList.remove("active");
        editForm.reset();
        editTagsDisplay.innerHTML = "";
        editTags = [];
    }
});

gallery.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    const tag = e.target.closest(".tag");

    if (tag) {
        const selectedTag = tag.dataset.tag;
        displayGallery(selectedTag, searchInput.value || currentMobileSearchQuery);
    } else if (card) {
        const index = parseInt(card.dataset.index);
        currentEditIndex = index;
        const image = images[index];
        document.getElementById("edit-image-preview").src = image.url;
        document.getElementById("edit-image-url").value = image.url;
        document.getElementById("edit-image-title").value = image.title;
        document.getElementById("edit-image-desc").value = image.description;

        editTags = [...image.tags];
        editTagsDisplay.innerHTML = "";
        editTags.forEach(tag => {
            const tagElement = document.createElement("div");
            tagElement.classList.add("tag-item-display");
            tagElement.innerHTML = `${tag} <span class="remove-tag">×</span>`;
            editTagsDisplay.appendChild(tagElement);

            tagElement.querySelector(".remove-tag").addEventListener("click", () => {
                editTags = editTags.filter(t => t !== tag);
                tagElement.remove();
            });
        });

        editFormOverlay.classList.add("active");
    }
});

searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    displayGallery(null, query);
});

mobileSearchIcon.addEventListener("click", () => {
    mobileSearchOverlay.classList.add("active");
    mobileSearchInput.value = currentMobileSearchQuery;
    mobileSearchInput.focus();
});

mobileSearchBtn.addEventListener("click", () => {
    currentMobileSearchQuery = mobileSearchInput.value;
    displayGallery(null, currentMobileSearchQuery);
    mobileSearchOverlay.classList.remove("active");
});

mobileSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        currentMobileSearchQuery = mobileSearchInput.value;
        displayGallery(null, currentMobileSearchQuery);
        mobileSearchOverlay.classList.remove("active");
    }
});

function checkImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(false);
        img.src = url;
    });
}

images.forEach((img, index) => {
    checkImage(img.url)
        .then(() => console.log(`${img.title} загружено`))
        .catch(() => {
            img.url = "https://cdn-icons-png.flaticon.com/512/2748/2748558.png";
            images[index] = img;
            saveImagesToLocalStorage();
            displayGallery(null, searchInput.value || currentMobileSearchQuery);
        });
});

gallery.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".card");
    if (card) {
        card.style.transform = "translateY(-10px) rotate(1deg)";
        card.querySelector("img").style.transform = "scale(1.1)";
    }
});

gallery.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".card");
    if (card) {
        card.style.transform = "translateY(0) rotate(0)";
        card.querySelector("img").style.transform = "scale(1)";
    }
});