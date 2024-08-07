import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <header className='container' style={{backgroundColor: "rgba(68, 75, 88, 1"}}>
        <div className='second-container footer'>
          <div ><Link className='headding-logo' to="/">Goods4you</Link></div>
          <div className='menu'>
            <a href="#catalog">Catalog</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </header>
    </>
  )
}

export default Footer
