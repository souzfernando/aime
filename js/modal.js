// ======================================================
// ABRIR / FECHAR DETALHES + SETA GIRANDO
// ======================================================
function toggleDetalhes(id, elemento) {
    const el = document.getElementById("detalhes-" + id);
    const p = produtos[id];

    // Alternar seta
    elemento.classList.toggle("open");

    // Preenche apenas ao abrir
    if (!el.classList.contains("open")) {
        el.innerHTML = `
            <p style="margin:0;">
                ${p.descricaoCompleta}
            </p>
        `;
    }

    // Alternar classe de abertura
    el.classList.toggle("open");

    if (!el.classList.contains("open")) {
        setTimeout(() => {
            el.style.display = "none";
        }, 200);
    } else {
        el.style.display = "block";
    }
}



// ======================================================
// FECHAR AO CLICAR FORA DO CARD
// ======================================================
document.addEventListener("click", function(e) {
    const cards = document.querySelectorAll(".produto-card");

    cards.forEach(card => {
        const detalhes = card.querySelector(".detalhes-produto");
        const setaTexto = card.querySelector(".ver-mais");

        if (!detalhes) return;

        // Se não está aberto → ignora
        if (!detalhes.classList.contains("open")) return;

        // Clicou fora do card → fecha
        if (!card.contains(e.target)) {
            detalhes.classList.remove("open");
            setaTexto.classList.remove("open");

            setTimeout(() => {
                detalhes.style.display = "none";
            }, 200);
        }
    });
});
