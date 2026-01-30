// VAR GLOBAL DO PLANNER
let produtoPlanner = {};

function initModalPlanner() {
    const modal = document.getElementById("modalPlanner");

    if (!modal) {
        console.error("Modal do planner não foi carregado ainda.");
        return;
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModalPlanner();
    });

    console.log("Eventos do modal do planner ativados.");
}

function abrirModalPlanner(id, nome, preco, img) {
    produtoPlanner = { id, nome, preco, img };
    document.getElementById("modalPlanner").style.display = "flex";
}

function fecharModalPlanner() {
    document.getElementById("modalPlanner").style.display = "none";
}
