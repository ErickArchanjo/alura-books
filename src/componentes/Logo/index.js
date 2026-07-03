import logo from '../../imagens/logo.svg'
import styled from 'styled-components'

function Logo() {
    return (
        <div className="align-items-center d-flex fs-3">
            <img className="img-fluid mr-2"
                src={logo}
                alt='logo' 
            />
            <p><strong>Alura</strong>Books</p>
       </div>
    )
}

export default Logo