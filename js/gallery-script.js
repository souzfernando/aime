const gallery = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const btnClose = document.getElementById("modal-close");

let images = [];
let currentIndex = 0;

// Carrega imagens numeradas automaticamente
async function loadImages() {
    let loaded = [];

    for (let i = 1; i <= 500; i++) {
        const path = `img/gallery/${i}.jpg`;
        const img = new Image();
        img.src = path;

        const exists = await new Promise(resolve => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });

        if (!exists) break;

        loaded.push(path);
    }

    // 🔀 Embaralha com Fisher-Yates
    for (let i = loaded.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [loaded[i], loaded[j]] = [loaded[j], loaded[i]];
    }

    images = loaded;

    // Cria galeria
    images.forEach((path, index) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.innerHTML = `<img src="${path}" loading="lazy">`;
        item.onclick = () => openModal(index);
        gallery.appendChild(item);
    });
}

function openModal(index) {
    currentIndex = index;
    modalImg.src = images[index];
    modal.style.display = "flex";
}

// Fecha modal
btnClose.onclick = () => modal.style.display = "none";
modal.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
};

// ⭐ Carrossel – próximo
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex];
}

// ⭐ Carrossel – anterior
function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex];
}

// Teclas ← →
document.addEventListener("keydown", e => {
    if (modal.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") modal.style.display = "none";
    }
});

loadImages();
