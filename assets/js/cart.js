// ============================
// CART.JS
// ============================

// =====================
// CUPOM DE DESCONTO
// =====================
let descontoValor = 0;
let cupomAtivo = null;

// Cupoms válidos (% + mínimo)
const cuponsValidos = {
    "BEMVINDO10": { porcentagem: 10, minimo: 100 }, 
    "AIME5":      { porcentagem: 5, minimo: 50 }
};

// ENTREGA
let taxaEntrega = 0;
let tipoEntrega = "RETIRAR"; // RETIRAR, BROTAS, FORA

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

// Atualiza o contador do carrinho
function updateCartCount() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((soma, item) => soma + (Number(item.quantidade) || 0), 0);

    const badgeDesk = document.getElementById('cart-count');
    if (badgeDesk) badgeDesk.textContent = totalItens;

    const badgeMobile = document.getElementById('cart-count-mobile');
    if (badgeMobile) badgeMobile.textContent = totalItens;
}

// Garante que atualize mesmo que o mobile carregue depois
function tentarUpdateCartCount(repeticoes = 10, intervalo = 200) {
    let cont = 0;
    const loop = setInterval(() => {
        updateCartCount();
        cont++;
        if (cont >= repeticoes) clearInterval(loop);
    }, intervalo);
}

// Adiciona item ao carrinho
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

// Carrega itens
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

    const totalComDesconto = total - descontoValor;
    const totalFinal = totalComDesconto < 0 ? 0 : totalComDesconto;

    if (totalEl) totalEl.textContent = 'R$ ' + totalFinal.toFixed(2);
}

// Altera quantidade
function alterarQtd(index, valor) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho[index].quantidade += valor;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarTotal();
    updateCartCount();
}

// Remove item
function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarTotal();
    updateCartCount();
}


// ============================
// AVISO DISCRETO (SEM POPUP)
// ============================
function mostrarErroEntrega(msg) {
    const erro = document.getElementById("erro-entrega");
    if (!erro) return;
    erro.textContent = msg;
    erro.style.display = "block";

    // Some depois
    setTimeout(() => {
        erro.style.display = "none";
    }, 4000);
}


// ============================
// FINALIZAR COMPRA VIA WHATSAPP
// ============================
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        mostrarErroEntrega("Seu carrinho está vazio!");
        return;
    }

    // Validação discreta
    if (tipoEntrega === "BROTAS") {
        const end = document.getElementById("endereco")?.value.trim();
        const bairro = document.getElementById("bairro")?.value.trim();
        const num = document.getElementById("numeroCasa")?.value.trim();

        if (!end || !bairro || !num) {
            mostrarErroEntrega("Preencha endereço, bairro e número para entrega em Brotas.");
            return;
        }
    }

    let mensagem = "*PEDIDO DE COMPRA*\n\n";
    let subtotal = 0;

    carrinho.forEach(item => {
        const valor = item.preco * item.quantidade;
        subtotal += valor;
        mensagem += `• *${item.nome}* (x${item.quantidade}) — R$ ${valor.toFixed(2)}\n`;
    });

    mensagem += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}`;

    if (descontoValor > 0) {
        mensagem += `\n*Desconto (${cupomAtivo}):* -R$ ${descontoValor.toFixed(2)}`;
    }

    if (tipoEntrega === "BROTAS") {
        mensagem += `\n*Endereço:* ${document.getElementById("endereco").value}, ${document.getElementById("bairro").value} — Nº ${document.getElementById("numeroCasa").value}`;
    }

    if (tipoEntrega === "BROTAS") {
        mensagem += `\n*Entrega:* R$ 5,00 (Brotas)`;
    } else if (tipoEntrega === "FORA") {
        mensagem += `\n*Entrega:* A combinar (fora de Brotas)`;
    } else {
        mensagem += `\n*Entrega:* Retirada no local`;
    }

    const totalFinal = subtotal - descontoValor + taxaEntrega;

    mensagem += `\n\n*TOTAL FINAL:* R$ ${totalFinal.toFixed(2)}\n`;
    mensagem += "\nDesejo finalizar meu pedido.";

    const texto = encodeURIComponent(mensagem).replace(/%0A/g, "%0D%0A");
    window.open(`https://wa.me/5514998423336?text=${texto}`, "_blank");
}



// ============================
// CUPOM
// ============================
function aplicarCupom() {
    const input = document.getElementById("cupom");
    const msg = document.getElementById("cupom-msg");
    if (!input || !msg) return;

    msg.textContent = "";
    const cupom = input.value.trim().toUpperCase();

    if (!cuponsValidos[cupom]) {
        msg.textContent = "Cupom inválido.";
        msg.style.color = "#f44336";
        return;
    }

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let subtotal = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

    const { porcentagem, minimo } = cuponsValidos[cupom];

    if (subtotal < minimo) {
        msg.textContent = `Cupom válido, mas requer mínimo de R$ ${minimo.toFixed(2)}.`;
        msg.style.color = "#fbb034";
        return;
    }

    descontoValor = subtotal * (porcentagem / 100);
    cupomAtivo = cupom;

    document.getElementById("desconto").innerText = "R$ " + descontoValor.toFixed(2);
    atualizarTotal();

    msg.textContent = `Cupom aplicado: ${porcentagem}% de desconto.`;
    msg.style.color = "#4caf50";
}



// ============================
// ENTREGA
// ============================
function selecionarEntrega(opcao) {
    tipoEntrega = opcao;

    const campoEndereco = document.getElementById("campo-endereco");

    if (opcao === "BROTAS") {
        taxaEntrega = 5;
        campoEndereco.style.display = "block";
    } else {
        taxaEntrega = 0;
        campoEndereco.style.display = "none";
    }

    atualizarTotal();
}



// ============================
// ATUALIZAR TOTAL
// ============================
function atualizarTotal() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let subtotal = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

    const subtotalEl = document.getElementById("subtotal");
    if (subtotalEl) subtotalEl.textContent = "R$ " + subtotal.toFixed(2);

    const totalFinal = subtotal - descontoValor + taxaEntrega;

    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.textContent = "R$ " + totalFinal.toFixed(2);

    const entregaEl = document.getElementById("entrega");
    if (entregaEl) entregaEl.textContent = "R$ " + taxaEntrega.toFixed(2);

    // ============================
    // REAPLICAR CUPOM AUTOMATICO
    // ============================
    if (cupomAtivo) {
        aplicarCupom(false); // false = não mostrar aviso discreto repetido
    }
}



// ============================
// INICIALIZA
// ============================
document.addEventListener('DOMContentLoaded', () => {
    tentarUpdateCartCount();
    carregarCarrinho();
});
