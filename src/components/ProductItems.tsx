import item from '../assets/img/productItem.jpg'
import star from '../assets/img/star.jpg'
import prices from '../assets/img/prices.jpg'
import Button from './Button'
function ProductItems() {
  const productItems = [
    {
      id: 1,
      img: item
    },
    {
      id: 2,
      img: item
    },
    {
      id: 3,
      img: item
    },
    {
      id: 4,
      img: item
    },
    {
      id: 5,
      img: item
    },
    {
      id: 6,
      img: item
    },
  ]
  return (
    <>
      <section className='second-container product'>
        <div>
          <img className='big-img' src={item} alt="product" />
          <div className='slider'>
            {productItems.map(item => (
              <img className='small-img' key={item.id} src={item.img} alt={`product ${item.id}`} />
            ))}
          </div>
        </div>
        <div className='product__desc'>
          <h1 className='product__desc_title'>Essence Mascara Lash Princess</h1>
          <div className='product__desc_star'>
            <img src={star} alt="star" />
            <p className='product__desc_category'>electronics, selfie accessories</p>
          </div>
          <h2 className='product__desc_subtitle'>In Stock - Only 5 left!</h2>
          <h3 className='product__desc_specification'>The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.</h3>
          <div className='product__desc_info' >
            <p>1 month warranty</p>
            <p>Ships in 1 month</p>
          </div>
          <div className='product__desc_discount'>
            <img src={prices} alt="prices" />
            <h4 className='product__desc_persent'>Your discount: <span>14.5%</span></h4>
            <Button btnName='Add to Cart' />
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductItems
