// CONFIGURE AQUI
const GITHUB_USER = "SEU_USUARIO";
const GITHUB_REPO = "SEU_REPOSITORIO";
const GALLERY_PATH = "img/gallery";

let files = [];
let currentIndex = 0;

async function loadGallery() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GALLERY_PATH}`;
    const gallery = document.getElementById("gallery");

    try {
        const res = await fetch(url);
        const data = await res.json();

        files = data
            .filter(item => item.type === "file")
            .map(item => item.download_url);

        files.forEach((src, index) => {
            const img = document.createElement("img");
            img.src = src;
            img.onclick = () => openLightbox(index);
            gallery.appendChild(img);
        });
    } catch (e) {
        console.error("Erro carregando imagens:", e);
    }
}

function openLightbox(index) {
    currentIndex = index;
    document.getElementById("lightboxImg").src = files[currentIndex];
    document.getElementById("lightbox").style.visibility = "visible";
}

function closeLightbox() {
    document.getElementById("lightbox").style.visibility = "hidden";
}

function nextImg() {
    currentIndex = (currentIndex + 1) % files.length;
    document.getElementById("lightboxImg").src = files[currentIndex];
}

function prevImg() {
    currentIndex = (currentIndex - 1 + files.length) % files.length;
    document.getElementById("lightboxImg").src = files[currentIndex];
}

// Eventos
window.onload = loadGallery;
document.getElementById("closeBtn").onclick = closeLightbox;
document.getElementById("nextBtn").onclick = nextImg;
document.getElementById("prevBtn").onclick = prevImg;
