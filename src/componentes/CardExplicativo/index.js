import styled from "styled-components"

function CardExplicativo() {
return (

    <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card text-center border-0 shadow-sm rounded p-4 mb-4">
                <h3 className="card-title mb-3">
                    Fique Atento
                </h3>
                <p className="card-text">
                    A pesquisa de livros é baseada na API da Open Library, que fornece informações sobre livros, autores e capas. No entanto, nem todos os livros possuem capas disponíveis. Nesses casos, uma imagem padrão será exibida para indicar a ausência da capa.
                </p>

                <span className="badge bg-warning text-dark">
                    Este é um ambiente para praticar e testar códigos
                </span>
            </div>
        </div>
    </div>

)}

export default CardExplicativo