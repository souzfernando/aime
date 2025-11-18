let produtoAtual = {};

function initModalModelos() {

    const modal = document.getElementById("modalModelos");

    if (!modal) {
        console.error("Modal de modelos não foi carregado ainda.");
        return;
    }

    // Clique fora fecha
    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModalModelos();
    });

    console.log("Eventos do modal de modelos ativados.");
}

function abrirModalModelos(id, nome, preco, img) {
    produtoAtual = { id, nome, preco, img };
    document.getElementById("modalModelos").style.display = "flex";
}

function fecharModalModelos() {
    document.getElementById("modalModelos").style.display = "none";
}
