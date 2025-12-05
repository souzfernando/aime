// 🔵 CARREGA TOPBAR
fetch("includes/topo.html")
    .then(r => r.text())
    .then(html => {
        const topoEl = document.getElementById("topo");
        if (topoEl) {
            topoEl.innerHTML = html;

            if (typeof updateCartCount === "function") {
                updateCartCount();
            }

            inicializarBusca();

            document.addEventListener('click', function(e){
                const el = e.target.closest('#cart-tab, .pex-cart, .cart-tab');
                if (!el) return;

                e.preventDefault();
                e.stopPropagation();
                abrirSidecart();
            });
        }
    });

// 🔵 CARREGA FOOTER
fetch("includes/footer.html")
    .then(r => r.text())
    .then(html => {
        const foot = document.getElementById("footer");
        if (foot) foot.innerHTML = html;
    });

// 🔵 CARREGA SIDECART
loadComponent("sidecart-container", "includes/sidecart.html", () => {
    if (typeof initSidecart === "function") {
        initSidecart();
    }
});
