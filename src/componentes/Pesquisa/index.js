import { useState } from 'react';
import axios from 'axios';
import noImage from '../../imagens/no-image.gif';

function Pesquisa() {
    const [termo, setTermo] = useState('');
    const [livros, setLivros] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    const lidarComBusca = async (evento) => {
        evento.preventDefault();
        
        if (!termo.trim()) return;

        setCarregando(true);
        setErro(null);

        try {
            // Configuração dos Headers exigida pela Open Library mapeada para o Axios
            const configuracao = {
                headers: {
                    'User-Agent': 'AluraBooks/1.0 (erick-archanjo@hotmail.com)' // Identificação do seu app
                }
            };

            // Fazendo a busca usando o Axios com os parâmetros configurados
            const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}`;
            const resposta = await axios.get(url, configuracao);
            
            // A Open Library retorna os resultados dentro de 'docs'
            if (resposta.data.docs && resposta.data.docs.length > 0) {
                setLivros(resposta.data.docs);
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

                    return (
                        <div className="col-md-4 mb-4" key={livro.key}>
                            <div className="card h-100 shadow-sm">
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
        </div>
    );
}

export default Pesquisa;