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

// Recupera o ID da postagem da URL
function getPostIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Função para exibir o conteúdo da postagem
function exibirPostagemCompleta() {
    const postId = getPostIdFromURL();
    const postagem = postagens.find(p => p.id === postId);

    if (postagem) {
        const postagemCompleta = document.getElementById('postagem-completa');
        postagemCompleta.innerHTML = `
            <h2>${postagem.titulo}</h2>
            <p class="date">${postagem.data}</p>
            <div class="conteudo">
                ${postagem.conteudo}
            </div>
            ${gerarTagsHTML(postagem.tags)}
        `;
    } else {
        // Postagem não encontrada
        const postagemCompleta = document.getElementById('postagem-completa');
        postagemCompleta.innerHTML = `
            <h2>Postagem não encontrada</h2>
            <p>Desculpe, a postagem que você está procurando não existe.</p>
        `;
    }
}

// Função para abrir a postagem
function abrirPostagem(id) {
    // Redireciona para a página de visualização da postagem com o ID como parâmetro
    window.location.href = `postagem.html?id=${id}`;
}

// Função para exibir as postagens mais vistas
function exibirMaisVistas() {
    const maisVistas = postagens.sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, 4);
    const cardsMaisVistas = document.getElementById("cards-mais-vistas");
    cardsMaisVistas.innerHTML = ''; // Limpa o conteúdo anterior
    maisVistas.forEach(postagem => {
        const card = document.createElement("div");
        card.classList.add("card-mais-vistas");
        card.addEventListener('click', () => {
            abrirPostagem(postagem.id);
        });
        card.innerHTML = `
            <h3>${postagem.titulo}</h3>
            <p>${postagem.conteudo.substring(0, 60)}...</p>
        `;
        cardsMaisVistas.appendChild(card);
    });
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

// Função para iniciar a busca
function iniciarBusca() {
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

// Chamar a função iniciarBusca após carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    iniciarBusca();
    // ... seu código existente ...
});

// Inicializar a página após carregar as postagens
carregarPostagens().then(() => {
    exibirPostagemCompleta();
    exibirMaisVistas();
});
