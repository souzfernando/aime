// ============================
// CART.JS
// ============================

// 🔧 Limpa dados antigos que possam ter formato incorreto
try {
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    if (Array.isArray(carrinho)) {
        carrinho.forEach(item => {
            if (typeof item.preco !== 'number') item.preco = Number(item.preco) || 0;
            if (!item.imagem && item.img) item.imagem = item.img;
        });
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
} catch(e) {
    localStorage.removeItem('carrinho');
}

// Atualiza o contador do carrinho no topo (desktop e mobile)
function updateCartCount() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((soma, item) => soma + (Number(item.quantidade) || 0), 0);

    // Desktop
    const badgeDesk = document.getElementById('cart-count');
    if (badgeDesk) badgeDesk.textContent = totalItens;

    // Mobile
    const badgeMobile = document.getElementById('cart-count-mobile');
    if (badgeMobile) badgeMobile.textContent = totalItens;
}

// Garante que o contador atualize mesmo que o mobile seja carregado depois
function tentarUpdateCartCount(repeticoes = 10, intervalo = 200) {
    let cont = 0;
    const loop = setInterval(() => {
        updateCartCount();
        cont++;
        if (cont >= repeticoes) clearInterval(loop);
    }, intervalo);
}

// Adiciona item ao carrinho recebendo um objeto
function addToCart(item) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const existente = carrinho.find(i => i.id === item.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({
            id: item.id,
            nome: item.nome,
            preco: Number(item.preco) || 0,
            quantidade: 1,
            imagem: item.img || ""
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartCount();
    carregarCarrinho();
}

// Carrega o carrinho na página
function carregarCarrinho() {
    const tabela = document.querySelector('#tabela-carrinho tbody');
    const subtotalEl = document.querySelector('#subtotal');
    const totalEl = document.querySelector('#total');

    if (!tabela) return;

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    tabela.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, i) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        tabela.innerHTML += `
            <tr>
                <td class="align-middle"><img src="${item.imagem}" style="width:50px;"> ${item.nome}</td>
                <td class="align-middle">R$ ${(Number(item.preco) || 0).toFixed(2)}</td>
                <td class="align-middle">
                    <div class="input-group quantity mx-auto" style="width:100px;">
                        <div class="input-group-btn">
                            <button class="btn btn-sm btn-primary" onclick="alterarQtd(${i}, -1)"><i class="fa fa-minus"></i></button>
                        </div>
                        <input type="text" class="form-control form-control-sm bg-secondary border-0 text-center" value="${item.quantidade}" readonly>
                        <div class="input-group-btn">
                            <button class="btn btn-sm btn-primary" onclick="alterarQtd(${i}, 1)"><i class="fa fa-plus"></i></button>
                        </div>
                    </div>
                </td>
                <td class="align-middle">R$ ${(subtotal || 0).toFixed(2)}</td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-danger" onclick="removerItem(${i})"><i class="fa fa-times"></i></button>
                </td>
            </tr>
        `;
    });

    if (subtotalEl) subtotalEl.textContent = 'R$ ' + total.toFixed(2);
    if (totalEl) totalEl.textContent = 'R$ ' + total.toFixed(2);
}

// Altera quantidade
function alterarQtd(index, valor) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho[index].quantidade += valor;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    updateCartCount();
}

// Remove item
function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    updateCartCount();
}

// Finaliza compra via WhatsApp
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let mensagem = "*Pedido de compra:*\n\n";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.nome} (x${item.quantidade}) - R$ ${subtotal.toFixed(2)}\n`;
    });

    mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n\n`;
    mensagem += "Desejo finalizar meu pedido.";

    const textoFormatado = encodeURIComponent(mensagem).replace(/%0A/g, "%0D%0A");
    const numero = "5514998423336"; 
    const url = `https://wa.me/${numero}?text=${textoFormatado}`;
    window.open(url, '_blank');
}

// Atualiza contador se localStorage mudar em outra aba
window.addEventListener('storage', updateCartCount);

// Inicializa carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Tenta atualizar várias vezes caso mobile ainda não exista
    tentarUpdateCartCount();
    carregarCarrinho();
});
