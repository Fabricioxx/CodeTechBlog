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

// Recupera a tag da URL
function getTagFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('tag');
}

// Função para exibir o título da categoria
function exibirTituloCategoria(tag) {
    const tituloElemento = document.getElementById('categoria-titulo');
    tituloElemento.textContent = tag;
}

// Função para exibir a lista de postagens filtradas
function exibirPostagensFiltradas(tag) {
    const postagensFiltradas = postagens
        .filter(postagem => postagem.tags.includes(tag))
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 10);

    const listaPostagens = document.getElementById('lista-postagens');
    listaPostagens.innerHTML = ''; // Limpa o conteúdo anterior

    if (postagensFiltradas.length === 0) {
        listaPostagens.innerHTML = '<p>Nenhuma postagem encontrada para esta categoria.</p>';
        return;
    }

    postagensFiltradas.forEach(postagem => {
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

// Função para exibir as postagens mais vistas da categoria
function exibirMaisVistasCategoria(tag) {
    const maisVistas = postagens
        .filter(postagem => postagem.tags.includes(tag))
        .sort((a, b) => b.visualizacoes - a.visualizacoes)
        .slice(0, 4);

    const cardsMaisVistas = document.getElementById('cards-mais-vistas');
    cardsMaisVistas.innerHTML = ''; // Limpa o conteúdo anterior

    if (maisVistas.length === 0) {
        cardsMaisVistas.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
        return;
    }

    maisVistas.forEach(postagem => {
        const card = document.createElement('div');
        card.classList.add('card-mais-vistas');
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
    const tag = getTagFromURL();
    if (tag) {
        exibirTituloCategoria(tag);
        exibirPostagensFiltradas(tag);
        exibirMaisVistasCategoria(tag);
    } else {
        // Se nenhuma tag for fornecida, redirecionar para a página inicial
        window.location.href = 'index.html';
    }
});
