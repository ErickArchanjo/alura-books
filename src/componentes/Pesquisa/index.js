import { useState, useEffect } from 'react';
import axios from 'axios';
import noImage from '../../imagens/no-image.gif';

function Pesquisa() {
    const [termo, setTermo] = useState('');
    const [livros, setLivros] = useState([]); // Guarda os 100 livros carregados de uma vez só
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const itens_por_pagina = 6; // Limite fixo de 6 por página

    // Carrega os favoritos do localStorage ao iniciar
    useEffect(() => {
        const favoritosSalvos = localStorage.getItem('aluraBooks_favoritos');
        if (favoritosSalvos) {
            setFavoritos(JSON.parse(favoritosSalvos));
        }
    }, []);

    const alternarFavorito = (livro) => {
        const jaEFavorito = favoritos.some((fav) => fav.key === livro.key);
        let novaListaFavoritos;

        if (jaEFavorito) {
            novaListaFavoritos = favoritos.filter((fav) => fav.key !== livro.key);
        } else {
            novaListaFavoritos = [...favoritos, livro];
        }

        setFavoritos(novaListaFavoritos);
        localStorage.setItem('aluraBooks_favoritos', JSON.stringify(novaListaFavoritos));
    };

    // 🌟 REQUISIÇÃO ÚNICA: Busca todos os resultados de uma vez só
    const lidarComBusca = async (evento) => {
        if (evento) evento.preventDefault();
        if (!termo.trim()) return;

        setCarregando(true);
        setErro(null);
        setPagina(1); // Sempre reseta para a página 1 em uma nova busca

        try {
            const configuracao = {
                headers: {
                    'User-Agent': 'AluraBooks/1.0 (erick-archanjo@hotmail.com)'
                }
            };

            // Sem o parâmetro &page= na URL. Buscamos a lista cheia (padrão de até 100 itens da Open Library)
            const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}`;
            const resposta = await axios.get(url, configuracao);

            if (resposta.data.docs && resposta.data.docs.length > 0) {
                setLivros(resposta.data.docs); // Salva a lista completa na memória do componente
            } else {
                setLivros([]);
                setErro('Nenhum livro encontrado com esse termo.');
            }
        } catch (err) {
            console.error("Erro na Open Library:", err);
            setErro('Ocorreu um erro ao buscar os livros. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    // 🌟 NAVEGAÇÃO LOCAL: Muda a página sem fazer novas requisições HTTP (sem carregar de novo)
    const irParaProximaPagina = () => {
        // Só avança se ainda houver livros na memória para mostrar
        if (pagina * itens_por_pagina < livros.length) {
            setPagina(pagina + 1);
            window.scrollTo(0, 0);
        }
    };

    const irParaPaginaAnterior = () => {
        if (pagina > 1) {
            setPagina(pagina - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-light ">Pesquisar na Open Library</h2>

            <form onSubmit={lidarComBusca} className="mb-5">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Digite o título do livro, autor..."
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                    />
                    <button className="btn btn-primary px-4" type="submit">
                        <i className="bi bi-search me-2"></i>Buscar
                    </button>
                </div>
            </form>

            {carregando && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            )}

            {erro && <div className="alert alert-danger text-center">{erro}</div>}

            <div className="row">
                {/* 🌟 SLICE LOCAL: Pega a lista total da memória e exibe apenas o pedaço de 6 atual */}
                {livros
                    .slice((pagina - 1) * itens_por_pagina, pagina * itens_por_pagina)
                    .map((livro) => {
                        const capa = livro.cover_i
                            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
                            : noImage;

                        const eFavorito = favoritos.some((fav) => fav.key === livro.key);
                        return (
                            <div className="col-md-4 mb-4" key={livro.key}>
                                <div className="card h-100 shadow-sm position-relative">
                                    <button
                                        className="btn position-absolute top-0 end-0 m-2 p-0 border-0 bg-transparent fs-4"
                                        onClick={() => alternarFavorito(livro)}
                                        style={{ zIndex: 10, color: eFavorito ? '#dc3545' : '#6c757d' }}
                                        title={eFavorito ? "Remover dos favoritos" : "Favoritar livro"}
                                    >
                                        <i className={`bi ${eFavorito ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                    </button>
                                    <img
                                        src={capa}
                                        className="card-img-top mx-auto mt-3"
                                        alt={livro.title}
                                        style={{ width: '128px', height: '193px', objectFit: 'contain' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = noImage;
                                        }}
                                    />
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="card-title text-truncate" title={livro.title}>{livro.title}</h5>
                                            <p className="card-text text-muted small">
                                                {livro.author_name?.join(', ') || 'Autor desconhecido'}
                                            </p>
                                            {livro.first_publish_year && (
                                                <p className="card-text small text-secondary">
                                                    Ano: {livro.first_publish_year}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                href={`https://openlibrary.org${livro.key}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-outline-primary btn-sm w-100"
                                            >
                                                Ver na Open Library
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            {/* Botões de navegação*/}
            {livros.length > 0 && !carregando && (
                <nav aria-label="Navegação de páginas" className="mt-5">
                    <ul className="pagination justify-content-center gap-2">

                        {/* Botão Anterior */}
                        <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                            <button
                                className="btn btn-light bg-white text-dark px-4 py-2 fw-bold"
                                onClick={irParaPaginaAnterior}
                                disabled={pagina === 1}
                            >
                                <i className="bi bi-arrow-left me-2"></i> Anterior
                            </button>
                        </li>

                        <li className="d-flex align-items-center px-3">
                            <span className="fw-bold text-light">Página {pagina}</span>
                        </li>

                        {/* Botão Próximo */}
                        {/* 🌟 SOLUÇÃO DO BLOQUEIO: Se a multiplicação da página atual por 6 for igual ou maior do que o total de livros salvos no array local, o botão bloqueia na hora! */}
                        <li className={`page-item ${pagina * itens_por_pagina >= livros.length ? 'disabled' : ''}`}>
                            <button
                                className="btn btn-light px-4 text-dark py-2 fw-bold bg-white"
                                onClick={irParaProximaPagina}
                                disabled={pagina * itens_por_pagina >= livros.length}
                            >
                                Próximo <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                        </li>

                    </ul>
                </nav>
            )}
        </div>
    );
}

export default Pesquisa;