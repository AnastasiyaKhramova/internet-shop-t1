import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Catalog from "../components/Catalog"
import Faq from "../components/Faq"
import Footer from "../components/Footer"
import Header from "../components/Header"
import Main from "../components/Main"
import { getToken } from "../utils/auth"

function Home() {
  useEffect(() => {
    document.title = 'Catalog | Goods4you';
  }, []);const navigate = useNavigate();
  useEffect(() => {
      document.title = 'My cart | Goods4you';
      const token = getToken();
      if (!token) {
          navigate('/login'); 
      }
  }, [navigate]);
  return (
    <>
      <Header />
      <Main />
      <Catalog />
      <Faq />
      <Footer />
    </>
  )
}

export default Home
