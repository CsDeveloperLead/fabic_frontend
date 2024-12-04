
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='w-full h-auto flex flex-col'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App