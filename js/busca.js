function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
            const originalBg = el.style.backgroundColor;
            el.style.backgroundColor = '#b3f3f0';
            setTimeout(() => el.style.backgroundColor = originalBg, 1500);
            break;
        }
    }

    if (!encontrado) alert('Texto não encontrado na página.');
}

document.getElementById('formBusca').addEventListener('submit', buscarTexto);
document.getElementById('btnBusca').addEventListener('click', buscarTexto);
