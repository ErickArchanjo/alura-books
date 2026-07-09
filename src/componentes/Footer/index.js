import styled from 'styled-components'

function Footer() {
    return (
        // Removida a classe "col" para o fundo ocupar 100% da largura
        <footer className="bg-light text-center w-100 mt-auto">
            <div className="container-fluid px-0">
                {/* Removidas as rows e cols desnecessárias que causavam o scroll horizontal */}
                <div className="text-center p-3 fs-6 fw-semibold" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    © 2026 Alura Books. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    )
}

export default Footer