// =============================
// PLANNER.JS — Totalmente separado da agenda
// =============================

// -----------------------------
// Variáveis globais do PLANNER
// -----------------------------
let plannerProduto = {};
let plannerImagens = [];
let plannerIndice = 0;
let plannerModeloAtual = "";
let plannerStartX = 0;
let plannerStartY = 0;

// -----------------------------
// Funções públicas (globais) — usadas pelo HTML
// -----------------------------
window.abrirModalPlanner = function (id, nome, preco, img) {
    plannerProduto = { id, nome, preco, img };

    const modal = document.getElementById("modalPlanner");
    if (!modal) {
        console.error("❌ modalPlanner não encontrado no DOM.");
        return;
    }
    modal.style.display = "flex";
};

window.fecharModalPlanner = function () {
    const modal = document.getElementById("modalPlanner");
    if (modal) modal.style.display = "none";
};

window.abrirGaleriaPlanner = function (pasta, nomeModelo) {
    plannerModeloAtual = nomeModelo;
    plannerImagens = [];

    for (let i = 1; i <= 8; i++) {
        plannerImagens.push(`assets/img/planner/${pasta}/${i}.jpg`);
    }

    plannerIndice = 0;
    mostrarPlannerImagem();

    // Fechar modal (se existir)
    const modal = document.getElementById("modalPlanner");
    if (modal) modal.style.display = "none";

    // Atualiza botão de escolher (se existir)
    const btn = document.getElementById("btnEscolherPlanner");
    if (btn) {
        btn.innerHTML = `<i class="fa fa-shopping-cart mr-2"></i>Escolher ${nomeModelo}`;
    }


    document.body.classList.add("no-scroll");

    const gal = document.getElementById("galeriaPlanner");
    if (gal) gal.style.display = "flex";
    else console.warn("galeriaPlanner não encontrada no DOM.");
};

function mostrarPlannerImagem() {
    const imgEl = document.getElementById("galeriaPlannerImagem");
    if (!imgEl) {
        console.warn("galeriaPlannerImagem não encontrada no DOM.");
        return;
    }
    imgEl.src = plannerImagens[plannerIndice] || "";
}
window.mostrarPlannerImagem = mostrarPlannerImagem;

window.mudarPlannerImagem = function (direcao) {
    plannerIndice += direcao;
    if (plannerIndice < 0) plannerIndice = plannerImagens.length - 1;
    if (plannerIndice >= plannerImagens.length) plannerIndice = 0;
    mostrarPlannerImagem();
};

window.fecharGaleriaPlanner = function () {
    const gal = document.getElementById("galeriaPlanner");
    if (gal) gal.style.display = "none";
    document.body.classList.remove("no-scroll");

    // Se a página não deve reabrir o modal por alguma classe (mesma lógica que a agenda)
    if (document.body.classList.contains("no-reopen")) return;

    // Reabre modal com os dados do produto atual (se existir)
    if (plannerProduto && plannerProduto.id) {
        abrirModalPlanner(
            plannerProduto.id,
            plannerProduto.nome,
            plannerProduto.preco,
            plannerProduto.img
            );
    }
};

window.escolherPlannerAtual = function () {
    if (typeof addToCart !== "function") {
        console.error("addToCart não encontrado - não é possível adicionar ao carrinho.");
        return;
    }

    addToCart({
        id:
        plannerProduto.id +
        "-" +
        plannerModeloAtual.replace(/\s+/g, "-").toLowerCase(),
        nome: plannerProduto.nome + " - " + plannerModeloAtual,
        preco: plannerProduto.preco,
        img: plannerImagens[0],
    });

    setTimeout(() => {
        fecharGaleriaPlanner();
        if (typeof abrirSidecart === "function") abrirSidecart();
    }, 150);

    if (typeof mostrarToast === "function") mostrarToast("Planner adicionado ao carrinho!");
};

// -----------------------------
// Inicialização dos eventos da galeria (clique fora, swipe)
// -----------------------------
function initPlannerGaleriaEvents() {
    const overlay = document.getElementById("galeriaPlanner");
    const content = document.querySelector("#galeriaPlanner .galeria-planner-container");

    if (!overlay || !content) {
        // console.log("Planner: galeria ainda não pronta para registrar eventos.");
        return;
    }

    // Evita múltiplos attachments: removemos antes
    overlay.removeEventListener("click", plannerOverlayClickHandler);
    content.removeEventListener("touchstart", plannerTouchStartHandler);
    content.removeEventListener("touchmove", plannerTouchMoveHandler);
    content.removeEventListener("touchend", plannerTouchEndHandler);

    overlay.addEventListener("click", plannerOverlayClickHandler);
    content.addEventListener("touchstart", plannerTouchStartHandler, { passive: true });
    content.addEventListener("touchmove", plannerTouchMoveHandler, { passive: false });
    content.addEventListener("touchend", plannerTouchEndHandler, { passive: true });

    console.log("Planner — eventos da galeria inicializados.");
}

// handlers nomeados para poder remover/reattach com segurança
function plannerOverlayClickHandler(e) {
    if (!e.target.closest(".galeria-planner-container")) fecharGaleriaPlanner();
}

function plannerTouchStartHandler(e) {
    plannerStartX = e.touches[0].clientX;
    plannerStartY = e.touches[0].clientY;
}

function plannerTouchMoveHandler(e) {
    const diffX = Math.abs(e.touches[0].clientX - plannerStartX);
    const diffY = Math.abs(e.touches[0].clientY - plannerStartY);

    if (diffX > diffY) e.preventDefault();
}

function plannerTouchEndHandler(e) {
    const diff = e.changedTouches[0].clientX - plannerStartX;

    if (Math.abs(diff) > 50) {
        if (diff > 0) mudarPlannerImagem(-1);
        else mudarPlannerImagem(1);
    }
}

// Tenta inicializar os eventos assim que a galeria ou modal forem injetados no DOM.
// Load-components.js deve disparar plannerHTMLCarregado (modal) e plannerGaleriaCarregada (galeria).
document.addEventListener("plannerHTMLCarregado", initPlannerGaleriaEvents);
document.addEventListener("plannerGaleriaCarregada", initPlannerGaleriaEvents);

// Fallback: caso os componentes já estejam no DOM quando o script for executado
document.addEventListener("DOMContentLoaded", () => {
    // espera um microtick para garantir injeção se load-components correu antes
    setTimeout(initPlannerGaleriaEvents, 50);
});

