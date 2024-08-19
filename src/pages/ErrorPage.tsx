import { useEffect } from "react";
import Footer from "../components/Footer"
import Header from "../components/Header"
import errorImg from '../assets/img/error.jpg'

function ErrorPage() {
  useEffect(() => {
    document.title = 'Error | Goods4you';
  }, []);
  return (
    <>
    <Header/>
      <img className="error-img" src={errorImg} alt="error" />
<Footer/>
    </>
  )
}

export default ErrorPage
