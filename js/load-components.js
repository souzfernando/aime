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
   🟩 MODAL DE MODELOS
────────────────────────────────────────────────── */
loadComponent("modal-modelos-container", "includes/modal-modelos.html", () => {
    console.log("Modal modelos carregado");

    // Agora sim registra os eventos
    if (typeof initModalModelos === "function") {
        initModalModelos();
    }
});


/* ────────────────────────────────────────────────
   🟧 GALERIA DE MIOLO
────────────────────────────────────────────────── */
loadComponent("galeria-miolo-container", "includes/galeria-miolo.html", () => {
    document.dispatchEvent(new Event("galeriaMioloCarregada"));
});


/* ────────────────────────────────────────────────
   🟥 HEAD
────────────────────────────────────────────────── */
fetch("includes/head.html")
    .then(r => r.text())
    .then(html => {
        const headEl = document.getElementById("head");
        if (headEl) {
            headEl.innerHTML = html;

            if (typeof updateCartCount === "function") {
                updateCartCount();
            }
        }
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
