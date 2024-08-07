import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <header className='container' style={{backgroundColor: "rgba(68, 75, 88, 1"}}>
        <div className='second-container footer'>
          <div ><Link className='headding-logo' to="/">Goods4you</Link></div>
          <div className='menu'>
          <Link to="/#catalog">Catalog</Link>
          <Link to="/#faq">FAQ</Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Footer
