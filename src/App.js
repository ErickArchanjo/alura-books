import Footer from './componentes/Footer'
import Header from './componentes/Header'
import Pesquisa from './componentes/Pesquisa'
import styled from 'styled-components'
import CardExplicativo from './componentes/CardExplicativo'

const AppContainer = styled.div`
    background-image: linear-gradient(90deg,#002F52 35%,#326589 165%);
`

function App() {
  return (
    <AppContainer className="d-flex flex-column min-vh-100">
      <Header />
      <Pesquisa />
      <div className="mt-auto">
      <CardExplicativo />
      <Footer />
      </div>
    </AppContainer>
  );
}

export default App
