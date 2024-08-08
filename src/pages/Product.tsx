import { useEffect } from "react";
import Footer from "../components/Footer"
import Header from "../components/Header"
import ProductItems from "../components/ProductItems"

function Product() {
  useEffect(() => {
    document.title = 'Essence Mascara Lash Princess | Goods4you';
  }, []);
  return (
    <div>
      <Header/>
      <ProductItems/>
      <Footer/>
    </div>
  )
}

export default Product
