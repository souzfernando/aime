function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function mostrarAviso(msg) {
    let aviso = document.getElementById('resultado-aviso');

    if (!aviso) {
        aviso = document.createElement('div');
        aviso.id = 'resultado-aviso';
        document.body.appendChild(aviso);
    }

    aviso.textContent = msg;
    aviso.style.opacity = '1';

    setTimeout(() => {
        aviso.style.opacity = '0';
    }, 3000);
}

function buscarTexto() {
    const input = document.getElementById('busca');
    const termo = removerAcentos(input.value.trim().toLowerCase());
    if (!termo) return;

    const elementos = document.querySelectorAll('body *');
    let encontrado = false;

    for (let el of elementos) {
        if (!el.textContent || el.offsetParent === null) continue;

        const texto = removerAcentos(el.textContent.toLowerCase());
        if (texto.includes(termo)) {
            encontrado = true;

            el.scrollIntoView({ behavior: 'smooth', block: 'center' });

            break;
        }
    }

    if (!encontrado) {
        mostrarAviso('Nenhum resultado encontrado.');
    }
}

function inicializarBusca() {
    const form = document.getElementById('formBusca');
    const btn = document.getElementById('btnBusca');
    if (!form || !btn) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        buscarTexto();
    });

    btn.addEventListener('click', buscarTexto);
}
