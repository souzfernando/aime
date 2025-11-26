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
        const linhaSubtotal = (item.preco || 0) * (item.quantidade || 0);

        box.innerHTML += `
            <div class="sidecart-item" style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                <img src="${item.imagem}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;">
                
                <div style="flex:1;min-width:0">
                    <strong style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.nome}</strong>
                    <small style="display:block;margin-top:4px;">R$ ${Number(item.preco || 0).toFixed(2)} cada</small>

                    <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
                        <button onclick="event.stopPropagation(); alterarQtd(${index}, -1); atualizarSidecart();" style="width:28px;height:28px;border-radius:4px;border:1px solid #ddd;background:#fff;">−</button>

                        <span style="min-width:28px;text-align:center;">${item.quantidade}</span>

                        <button onclick="event.stopPropagation(); alterarQtd(${index}, 1); atualizarSidecart();" style="width:28px;height:28px;border-radius:4px;border:1px solid #ddd;background:#fff;">+</button>
                    </div>
                </div>

                <div style="text-align:right;min-width:80px;">
                    <div style="font-weight:600">R$ ${linhaSubtotal.toFixed(2)}</div>
                    <button onclick="event.stopPropagation(); removerItem(${index}); atualizarSidecart();" 
                            style="background:none;border:none;color:#d9534f;margin-top:6px;font-size:18px;">
                        ✖
                    </button>
                </div>
            </div>
        `;
    });

    atualizarTotal();
}


const _addToCart_original = addToCart;

addToCart = function (item) {
    _addToCart_original(item);
    mostrarToast('Produto adicionado ao carrinho!');
    abrirSidecart();
};


// === FECHAR AO CLICAR FORA ===
document.addEventListener("click", function (e) {
    const sidecart = document.getElementById("sidecart");
    const overlay = document.getElementById("sidecart-overlay");

    if (!sidecart || !overlay) return;

    if (overlay.style.display !== "block") return;

    if (sidecart.contains(e.target)) return;

    if (e.target.closest("[onclick*='addToCart']")) return;

    fecharSidecart();
});


// === BOTÃO CART-TAB (APENAS SE EXISTIR) ===
const cartTab = document.getElementById("cart-tab");

if (cartTab) {
    cartTab.addEventListener("click", function (e) {
        e.stopPropagation();
        abrirSidecart();
    });
}
