let postagens = [];

// Função para carregar as postagens do arquivo JSON
function carregarPostagens() {
    return fetch('postagens.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(data => {
            postagens = data;
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Recupera o termo de busca da URL
function getTermoBuscaFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('termo');
}

// Função para exibir os resultados da busca
function exibirResultadosBusca(termo) {
    const resultados = postagens.filter(postagem => {
        // Procura o termo no título, conteúdo ou tags (case-insensitive)
        const termoLower = termo.toLowerCase();
        const tituloMatch = postagem.titulo.toLowerCase().includes(termoLower);
        const conteudoMatch = postagem.conteudo.toLowerCase().includes(termoLower);
        const tagsMatch = postagem.tags.some(tag => tag.toLowerCase().includes(termoLower));
        return tituloMatch || conteudoMatch || tagsMatch;
    });

    const listaPostagens = document.getElementById('lista-postagens');
    listaPostagens.innerHTML = ''; // Limpa o conteúdo anterior

    if (resultados.length === 0) {
        listaPostagens.innerHTML = `
            <div class="card card-mensagem">
                <div class="card-content">
                    <h3>Nenhuma postagem encontrada</h3>
                    <p>Tente usar outros termos de busca ou verifique a ortografia.</p>
                </div>
            </div>
        `;
        return;
    }
    

    resultados.forEach(postagem => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = `url('${postagem.imagem}')`;
        card.innerHTML = `
            <div class="card-content">
                <h3>${postagem.titulo}</h3>
                <p>${postagem.data}</p>
                ${gerarTagsHTML(postagem.tags)}
            </div>
        `;
        card.addEventListener('click', () => {
            abrirPostagem(postagem.id);
        });
        listaPostagens.appendChild(card);
    });
}

// Função para abrir a postagem
function abrirPostagem(id) {
    // Redireciona para a página de visualização da postagem com o ID como parâmetro
    window.location.href = `postagem.html?id=${id}`;
}

// Função para gerar o HTML das tags
function gerarTagsHTML(tags) {
    if (tags && tags.length > 0) {
        const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
        return `<div class="tags">${tagsHTML}</div>`;
    } else {
        return '';
    }
}

// Função para iniciar a busca novamente na página de resultados
function iniciarBuscaNaPagina() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function buscar() {
        const termo = searchInput.value.trim();
        if (termo) {
            window.location.href = `busca.html?termo=${encodeURIComponent(termo)}`;
        }
    }

    // Evento para o botão de busca
    searchButton.addEventListener('click', buscar);

    // Evento para a tecla Enter no campo de busca
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            buscar();
        }
    });
}

// Inicializar a página após carregar as postagens
carregarPostagens().then(() => {
    const termo = getTermoBuscaFromURL();
    if (termo) {
        // Preenche o campo de busca com o termo
        document.getElementById('search-input').value = termo;
        exibirResultadosBusca(termo);
        iniciarBuscaNaPagina();
    } else {
        // Se nenhum termo for fornecido, redirecionar para a página inicial
        window.location.href = 'index.html';
    }
});
