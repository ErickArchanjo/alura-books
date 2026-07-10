const textoOpcoes = ['CATEGORIAS', 'FAVORITOS', 'MINHA ESTANTE'];

function OpcoesHeader() {
    return (
      
            <ul className="d-flex list-unstyled mx-4 p-0 align-items-center">
                {textoOpcoes.map((texto) => (
                    <li
                        key={texto}
                        className="px-2"
                        style={{ minWidth: '120px', cursor: 'pointer', textAlign: 'center' }}
                    >
                        <span className="fw-semibold">{texto}</span>
                    </li>
                ))}
            </ul>

    );
}

// Garanta que o export default está aqui no final
export default OpcoesHeader;