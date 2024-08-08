import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <header className='container' style={{backgroundColor: "rgba(68, 75, 88, 1"}}>
        <div className='second-container footer'>
          <div ><Link className='headding-logo' to="/">Goods4you</Link></div>
          <nav className='menu' aria-label="Navigation">
          <Link to="/#catalog" aria-label="Catalog">Catalog</Link>
          <Link to="/#faq" aria-label="FAQ">FAQ</Link>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Footer
