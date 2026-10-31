// js/app.js
import { loginWithGoogle, checkAuthState } from './auth.js';
import { getCategorias, getFerramentas } from './database.js';

document.addEventListener('DOMContentLoaded', async () => {
    checkAuthState(false); 

    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin && btnLogin.textContent.trim() === "Login com Google") {
        btnLogin.addEventListener('click', loginWithGoogle);
    }

    const selectFiltro = document.getElementById('categoryFilter');
    const containerFerramentas = document.getElementById('toolsContainer');
    
    let todasFerramentas = [];

    // Função para renderizar os cards
    const renderizarFerramentas = (ferramentas, categoriasMap) => {
        containerFerramentas.innerHTML = '';
        
        if (ferramentas.length === 0) {
            containerFerramentas.innerHTML = '<p>Nenhuma ferramenta encontrada.</p>';
            return;
        }

        ferramentas.forEach(f => {
            const nomeCategoria = categoriasMap[f.idCategoria] || 'Sem Categoria';
            const logoImg = f.urlLogo ? `<img src="${f.urlLogo}" alt="Logo de ${f.nome}" class="tool-logo">` : '';
            
            const card = document.createElement('article');
            card.className = 'tool-card';
            card.innerHTML = `
                <div class="tool-header">
                    ${logoImg}
                    <div class="tool-title">
                        <h3>${f.nome}</h3>
                        <span class="tool-tag">${nomeCategoria}</span>
                    </div>
                </div>
                <div class="tool-body">
                    <p><strong>Objetivo:</strong> ${f.resumo}</p>
                    ${f.dicas ? `<p class="tool-tips"><strong>Dica:</strong> ${f.dicas}</p>` : ''}
                </div>
                <div class="tool-footer">
                    <a href="${f.link}" target="_blank" rel="noopener noreferrer" class="btn-primary" aria-label="Acessar ${f.nome}">Acessar Ferramenta</a>
                </div>
            `;
            containerFerramentas.appendChild(card);
        });
    };

    // Carregar dados iniciais
    try {
        const categorias = await getCategorias();
        todasFerramentas = await getFerramentas();

        // Mapear IDs de categoria para Nomes (para facilitar a exibição no card)
        const categoriasMap = {};
        categorias.forEach(c => {
            categoriasMap[c.id] = c.nome;
            // Preencher o select de filtros
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nome;
            selectFiltro.appendChild(option);
        });

        // Renderizar tudo inicialmente
        renderizarFerramentas(todasFerramentas, categoriasMap);

        // Lógica de filtro
        selectFiltro.addEventListener('change', (e) => {
            const idSelecionado = e.target.value;
            if (idSelecionado === 'todas') {
                renderizarFerramentas(todasFerramentas, categoriasMap);
            } else {
                const filtradas = todasFerramentas.filter(f => f.idCategoria === idSelecionado);
                renderizarFerramentas(filtradas, categoriasMap);
            }
        });

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        containerFerramentas.innerHTML = '<p>Erro ao carregar o catálogo.</p>';
    }
});