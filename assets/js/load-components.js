// 🔵 Função genérica para carregar componentes externos
function loadComponent(id, file, callback = null) {
    fetch(file)
        .then(res => res.text())
        .then(html => {
            const el = document.getElementById(id);

            if (!el) {
                console.warn(`Elemento #${id} não encontrado para carregar ${file}`);
                return;
            }

            el.innerHTML = html;

            // callback só roda depois que o HTML foi injetado
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => console.error("Erro ao carregar componente:", file, err));
}

/* ────────────────────────────────────────────────
   🟦 SIDECART — carrega e só depois inicializa
────────────────────────────────────────────────── */
loadComponent("sidecart-container", "includes/sidecart.html", () => {
    if (typeof initSidecart === "function") {
        initSidecart(); // agora o HTML existe
    }
});

/* ────────────────────────────────────────────────
   🟩 MODAL DE AGENDAS
────────────────────────────────────────────────── */
loadComponent("modal-modelos-container", "includes/modal-modelos.html", () => {
    console.log("Modal modelos carregado");

    if (typeof initModalModelos === "function") {
        initModalModelos();
    }
});

/* ────────────────────────────────────────────────
   🟦 MODAL DO PLANNER
────────────────────────────────────────────────── */
loadComponent("modal-planner-container", "includes/modal-planner.html", () => {
    console.log("Modal planner carregado");

    if (typeof initModalPlanner === "function") {
        initModalPlanner();
    }

    // 🔵 AVISA QUE O HTML DO PLANNER ESTÁ PRONTO
    document.dispatchEvent(new Event("plannerHTMLCarregado"));
});

/* ────────────────────────────────────────────────
   🟧 GALERIA DA AGENDA
────────────────────────────────────────────────── */
loadComponent("galeria-miolo-container", "includes/galeria-miolo.html", () => {
    document.dispatchEvent(new Event("galeriaMioloCarregada"));
});

/* ────────────────────────────────────────────────
   🟧 GALERIA DO PLANNER
────────────────────────────────────────────────── */
loadComponent("galeria-planner-container", "includes/galeria-planner.html", () => {
    document.dispatchEvent(new Event("plannerGaleriaCarregada"));
    console.log("Galeria do Planner carregada");
});

/* ────────────────────────────────────────────────
   🟥 TOPO
────────────────────────────────────────────────── */
fetch("includes/topo.html")
    .then(r => r.text())
    .then(html => {
        const topoEl = document.getElementById("topo");

        if (topoEl) {
            topoEl.innerHTML = html;

            if (typeof updateCartCount === "function") {
                updateCartCount();
            }
        }

        // 🔵 AGORA SIM o topo existe → registrar eventos da busca
        inicializarBusca();

        // Clique no carrinho
        document.addEventListener('click', function (e) {
            const el = e.target.closest('#cart-tab, .pex-cart, .cart-tab');
            if (!el) return;

            e.preventDefault();
            e.stopPropagation();
            abrirSidecart();
        });
    });

/* ────────────────────────────────────────────────
   🟪 FOOTER
────────────────────────────────────────────────── */
fetch("includes/footer.html")
    .then(r => r.text())
    .then(html => {
        const foot = document.getElementById("footer");
        if (foot) foot.innerHTML = html;
    });

/* ────────────────────────────────────────────────
   🟦 PRODUTOS
────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    fetch("includes/products.html")
        .then(res => res.text())
        .then(html => {
            const el = document.getElementById("products-container");

            if (!el) {
                console.warn("products-container não encontrado no DOM!");
                return;
            }

            el.innerHTML = html;
        })
        .catch(err => console.error("Erro ao carregar produtos:", err));
});
