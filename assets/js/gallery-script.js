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
        const path = `assets/img/gallery/${i}.jpg`;
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

// ===============================
// ⭐ SWIPE NO MOBILE – FUNCIONANDO
// ===============================
const modalEl = document.getElementById("modal");
const modalImgEl = document.getElementById("modal-img");

let swipeStartX = 0;
let swipeStartY = 0;

modalImgEl.addEventListener("touchstart", (e) => {
    // só registra se o modal estiver aberto
    if (modalEl.style.display === "flex") {
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
    }
}, { passive: true });

modalImgEl.addEventListener("touchmove", (e) => {
    if (modalEl.style.display !== "flex") return;

    let diffX = Math.abs(e.touches[0].clientX - swipeStartX);
    let diffY = Math.abs(e.touches[0].clientY - swipeStartY);

    // se movimento é horizontal → bloqueia scroll vertical
    if (diffX > diffY) {
        e.preventDefault();
    }
}, { passive: false });

modalImgEl.addEventListener("touchend", (e) => {
    if (modalEl.style.display !== "flex") return;

    let swipeEndX = e.changedTouches[0].clientX;
    let diff = swipeEndX - swipeStartX;

    // distância mínima para reconhecer swipe
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            prevImage(); // arrastou pra direita → imagem anterior
        } else {
            nextImage(); // arrastou pra esquerda → próxima
        }
    }
}, { passive: true });


loadImages();
