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

// Função para abrir a postagem
function abrirPostagem(id) {
    // Redireciona para a página de visualização da postagem com o ID como parâmetro
    window.location.href = `postagem.html?id=${id}`;
}

// Função para exibir a última postagem (card principal)
function exibirPostagemPrincipal() {
    const ultimaPostagem = postagens.sort((a, b) => new Date(b.data) - new Date(a.data))[0];
    const postagemPrincipal = document.getElementById("postagem-principal");
    postagemPrincipal.innerHTML = `
        <div class="card" style="background-image: url('${ultimaPostagem.imagem}');" onclick="abrirPostagem(${ultimaPostagem.id})">
            <div class="card-content">
                <h2>${ultimaPostagem.titulo}</h2>
                <p>${ultimaPostagem.data}</p>
                ${gerarTagsHTML(ultimaPostagem.tags)}
            </div>
        </div>
    `;
}

// Função para exibir o grid de postagens (exceto a última)
function exibirGridPostagens() {
    const outrasPostagens = postagens.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(1);
    const gridPostagens = document.getElementById("grid-postagens");
    gridPostagens.innerHTML = ''; // Limpa o conteúdo anterior
    outrasPostagens.forEach(postagem => {
        const card = document.createElement("div");
        card.classList.add("card");
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
        gridPostagens.appendChild(card);
    });
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

// Adicione este código no final do script.js

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
});


// Inicializar o blog após carregar as postagens
carregarPostagens().then(() => {
    exibirPostagemPrincipal();
    exibirGridPostagens();
    exibirMaisVistas();
});
