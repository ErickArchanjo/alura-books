import { useState } from 'react';
import Logo from '../Logo';
import OpcoesHeader from '../OpcoesHeader';
import IconesHeader from '../IconesHeader';
import styled from 'styled-components';

function Header() {
    const [aberto, setAberto] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm rounded px-3 py-4">
            {/* Container principal centralizado */}
            <div className="container justify-content-center position-relative d-flex align-items-center gap-4">
                
                {/* 1. Logo (Sempre visível no centro) */}
                <Logo />

                {/* 2. As Opções (Único componente que some no celular e vira hambúrguer) */}
                <div className={`collapse navbar-collapse ${aberto ? 'show' : ''} flex-grow-0`}>
                    <div className="mt-3 mt-lg-0 text-center">
                        <OpcoesHeader />
                    </div>
                </div>

                {/* 3. Os Ícones (Sempre visíveis no centro, ao lado da Logo e Opções) */}
                <IconesHeader />

                {/* Botão Hambúrguer (Flutuando na direita, aparece apenas no celular) */}
                <button 
                    className="navbar-toggler position-absolute end-0 me-3" 
                    type="button"
                    onClick={() => setAberto(!aberto)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

            </div>
        </nav>
    );
}

export default Header;