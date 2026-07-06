import { useState, useEffect } from 'react';
import axios from 'axios';
import noImage from '../../imagens/no-image.gif';

function Pesquisa() {
    const [termo, setTermo] = useState('');
    const [livros, setLivros] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [pagina, setPagina] = useState(1);



    // useEffect para carregar os favoritos do localStorage assim que a página abrir
    useEffect(() => {
        const favoritosSalvos = localStorage.getItem('aluraBooks_favoritos');
        if (favoritosSalvos) {
            setFavoritos(JSON.parse(favoritosSalvos));
        }
    }, []);

    // Função para adicionar ou remover um livro da lista de favoritos
    const alternarFavorito = (livro) => {
        const jaEFavorito = favoritos.some((fav) => fav.key === livro.key);
        let novaListaFavoritos;

        if (jaEFavorito) {
            // Se já for favorito, remove da lista
            novaListaFavoritos = favoritos.filter((fav) => fav.key !== livro.key);
        } else {
            // Se não for, adiciona o objeto do livro inteiro na lista
            novaListaFavoritos = [...favoritos, livro];
        }

        setFavoritos(novaListaFavoritos);
        // Salva a nova lista no localStorage convertida em texto (string)
        localStorage.setItem('aluraBooks_favoritos', JSON.stringify(novaListaFavoritos));
    };


    // Função para lidar com a busca de livros na Open Library
    const lidarComBusca = async (evento, paginaAlvo = 1) => {
        if (evento) evento.preventDefault();

        if (!termo.trim()) return;

        setCarregando(true);
        setErro(null);
        

        try {
            // Configuração dos Headers exigida pela Open Library mapeada para o Axios
            const configuracao = {
                headers: {
                    'User-Agent': 'AluraBooks/1.0 (erick-archanjo@hotmail.com)' // Identificação do app
                }
            };

            // Fazendo a busca usando o Axios com os parâmetros configurados
            const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&page=${paginaAlvo}`;
            const resposta = await axios.get(url, configuracao);

            // A Open Library retorna os resultados dentro de 'docs'
            if (resposta.data.docs && resposta.data.docs.length > 0) {
                setLivros(resposta.data.docs);
                setPagina(paginaAlvo);
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

    const irParaProximaPagina = () => {
            const proxima = pagina + 1;
            lidarComBusca(null, proxima); // Dispara a busca passando a nova página
            window.scrollTo(0, 0); // Opcional: joga o scroll do usuário de volta para o topo da página
        };

        const irParaPaginaAnterior = () => {
            if (pagina > 1) {
                const anterior = pagina - 1;
                lidarComBusca(null, anterior);
                window.scrollTo(0, 0);
            }
        };


    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">Pesquisar na Open Library</h2>

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
                {livros.map((livro) => {
                    // Montando a URL da capa usando o 'cover_i' (ID da capa) fornecido pela API
                    const capa = livro.cover_i
                        ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
                        : noImage;

                    const eFavorito = favoritos.some((fav) => fav.key === livro.key);
                    return (
                        <div className="col-md-4 mb-4" key={livro.key}>
                            <div className="card h-100 shadow-sm">
                                {/* 5. BOTÃO DE CORAÇÃO (FAVORITOS) */}
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
            {/* Só exibe a paginação se houver livros carregados e não estiver buscando dados */}
            {livros.length > 0 && !carregando && (
                <nav aria-label="Navegação de páginas dos livros" className="mt-5">
                    <ul className="pagination justify-content-center gap-2">

                        {/* Botão Anterior */}
                        <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                            <button
                                className="btn btn-outline-primary px-4 py-2 fw-bold"
                                onClick={irParaPaginaAnterior}
                                disabled={pagina === 1} // Desativa o botão se estiver na página 1
                            >
                                <i className="bi bi-arrow-left me-2"></i> Anterior
                            </button>
                        </li>

                        {/* Indicador da página atual */}
                        <li className="d-flex align-items-center px-3">
                            <span className="text-muted fw-bold">Página {pagina}</span>
                        </li>

                        {/* Botão Próximo */}
                        <li className="page-item">
                            <button
                                className="btn btn-outline-primary px-4 py-2 fw-bold"
                                onClick={irParaProximaPagina}
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