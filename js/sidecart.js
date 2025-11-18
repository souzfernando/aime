function abrirSidecart() {
    document.getElementById("sidecart-overlay").style.display = "block";
    document.getElementById("sidecart").style.right = "0px";
    atualizarSidecart();
}

function fecharSidecart() {
    document.getElementById("sidecart-overlay").style.display = "none";
    document.getElementById("sidecart").style.right = "-420px";
}

function atualizarSidecart() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const box = document.getElementById("sidecart-items");
    if (!box) return;

    box.innerHTML = "";
    carrinho.forEach((item, index) => {
        box.innerHTML += `
                <div class="sidecart-item">
                    <img src="${item.imagem}">
                    <div style="flex:1">
                        <strong>${item.nome}</strong><br>
                        R$ ${(item.preco || 0).toFixed(2)}<br>
                        <small>Qtd: ${item.quantidade}</small>
                    </div>
                    <button onclick="event.stopPropagation(); removerItem(${index}); atualizarSidecart();" style="background:none;border:none;color:red;font-size:18px;">✖</button>
                </div>
        `;
    });
}

const _addToCart_original = addToCart;

addToCart = function (item) {
    _addToCart_original(item);
    mostrarToast('Produto adicionado ao carrinho!');
    abrirSidecart();
};

document.addEventListener("click", function (e) {
    const sidecart = document.getElementById("sidecart");
    const overlay = document.getElementById("sidecart-overlay");

    if (!sidecart || !overlay) return;

            // Carrinho fechado → não faz nada
    if (overlay.style.display !== "block") return;

            // Clique dentro da aba do carrinho → não fecha
    if (sidecart.contains(e.target)) return;

            // Clique dentro de qualquer botão que adiciona ao carrinho → não fecha
    if (e.target.closest("[onclick*='addToCart']")) return;

            // Se chegou aqui → clicou fora → fecha
    fecharSidecart();
});

document.getElementById("cart-tab").addEventListener("click", function (e) {
            e.stopPropagation(); // garante que o "fechar ao clicar fora" não feche a aba ao abrir
            abrirSidecart();
        });