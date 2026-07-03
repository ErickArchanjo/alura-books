import Logo from '../Logo'
import OpcoesHeader from '../OpcoesHeader'
import IconesHeader from '../IconesHeader'
import styled from 'styled-components'

function Header() {
    return (

        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm rounded px-3 justify-content-center py-4">
            <Logo/>
            <OpcoesHeader/>
            <IconesHeader/>
        </nav>
    )
}

export default Header