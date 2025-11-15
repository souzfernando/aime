// VARIÁVEIS GLOBAIS
let produtoAtual = {};
let imagensAtuais = [];
let indiceAtual = 0;
let modeloAtual = "";
let startX = 0;
let startY = 0;

// 🟩 Abre o modal dos modelos
function abrirModalModelos(id, nome, preco, img) {
    produtoAtual = { id, nome, preco, img };
    document.getElementById("modalModelos").style.display = "flex";
}

// 🟥 Fecha o modal dos modelos
function fecharModalModelos() {
    document.getElementById("modalModelos").style.display = "none";
}

// 🟦 Abre a galeria do miolo
function abrirGaleria(pasta, nomeModelo) {
    modeloAtual = nomeModelo;
    imagensAtuais = [];

    for (let i = 1; i <= 8; i++) {
        imagensAtuais.push(`img/miolo/${pasta}/${i}.jpg`);
    }

    indiceAtual = 0;
    mostrarImagem();

    fecharModalModelos();

    document.getElementById("btnEscolherModelo").innerHTML =
        `<i class="fa fa-shopping-cart mr-2"></i>Escolher ${nomeModelo}`;

    document.body.classList.add("no-scroll");
    document.getElementById("galeriaMiolo").style.display = "flex";
}

// 🖼️ Mostra imagem atual
function mostrarImagem() {
    document.getElementById("galeriaImagem").src = imagensAtuais[indiceAtual];
}

// ⬅➡ Muda imagem da galeria
function mudarImagem(dir) {
    indiceAtual += dir;
    if (indiceAtual < 0) indiceAtual = imagensAtuais.length - 1;
    if (indiceAtual >= imagensAtuais.length) indiceAtual = 0;
    mostrarImagem();
}

// ❌ Fecha a galeria
function fecharGaleria() {
    document.getElementById("galeriaMiolo").style.display = "none";
    document.body.classList.remove("no-scroll");
}

// 🛒 Adiciona ao carrinho
function escolherModeloAtual() {
    addToCart({
        id: produtoAtual.id + "-" + modeloAtual.replace(/\s+/g, "-").toLowerCase(),
        nome: produtoAtual.nome + " - " + modeloAtual,
        preco: produtoAtual.preco,
        img: imagensAtuais[0],
    });

    setTimeout(() => {
        fecharGaleria();
        abrirSidecart();
    }, 150);

    mostrarToast("Produto adicionado ao carrinho!");
}

// Toast
function mostrarToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 2000);
}

// 🟦 Inicializa eventos SOMENTE após HTML existir
document.addEventListener("galeriaMioloCarregada", () => {
    console.log("GALERIA CARREGADA — eventos ativados");

    const galeriaOverlay = document.getElementById("galeriaMiolo");
    const galeriaContent = document.querySelector("#galeriaMiolo .galeria-container");

    // 🖱️ Clique fora fecha galeria
    galeriaOverlay.addEventListener("click", (e) => {
        if (!e.target.closest(".galeria-container")) fecharGaleria();
    });

    // 📱 Swipe mobile
    galeriaContent.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    galeriaContent.addEventListener("touchmove", (e) => {
        let diffX = Math.abs(e.touches[0].clientX - startX);
        let diffY = Math.abs(e.touches[0].clientY - startY);

        if (diffX > diffY) {
            e.preventDefault(); // impede scroll vertical durante swipe horizontal
        }
    });

    galeriaContent.addEventListener("touchend", (e) => {
        let diff = e.changedTouches[0].clientX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) mudarImagem(-1);
            else mudarImagem(1);
        }
    });
});

// ESC fecha
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        fecharModalModelos();
        fecharGaleria();
    }
});
