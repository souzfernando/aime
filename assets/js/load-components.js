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

            if (typeof callback === "function") callback();
        })
        .catch(err => console.error("Erro ao carregar componente:", file, err));
}

// 🟩 MODAL AGENDAS
loadComponent("modal-modelos-container", "includes/modal-modelos.html", () => {
    if (typeof initModalModelos === "function") initModalModelos();
});

// 🟦 MODAL PLANNER
loadComponent("modal-planner-container", "includes/modal-planner.html", () => {
    if (typeof initModalPlanner === "function") initModalPlanner();
    document.dispatchEvent(new Event("plannerHTMLCarregado"));
});

// 🟧 GALERIA MIOLo
loadComponent("galeria-miolo-container", "includes/galeria-miolo.html", () => {
    document.dispatchEvent(new Event("galeriaMioloCarregada"));
});

// 🟧 GALERIA PLANNER
loadComponent("galeria-planner-container", "includes/galeria-planner.html", () => {
    document.dispatchEvent(new Event("plannerGaleriaCarregada"));
});

// 🟦 PRODUTOS
document.addEventListener("DOMContentLoaded", () => {
    fetch("includes/products.html")
        .then(res => res.text())
        .then(html => {
            const el = document.getElementById("products-container");
            if (!el) return;
            el.innerHTML = html;
        });
});
