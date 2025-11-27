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

    // elementos realmente de texto (muito mais preciso)
    const seletor = 'p, span, li, a, h1, h2, h3, h4, h5, h6, small, label';
    const elementos = document.querySelectorAll(seletor);

    let encontrado = false;

    for (let el of elementos) {
        if (!el.textContent) continue;
        if (el.offsetParent === null) continue; // escondidos

        const texto = removerAcentos(el.textContent.toLowerCase());

        // match mais preciso: palavra completa
        const regex = new RegExp(`\\b${termo}\\b`, 'i');

        if (regex.test(texto)) {
            encontrado = true;
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.outline = '2px solid red';

            setTimeout(() => (el.style.outline = ''), 2000);
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
