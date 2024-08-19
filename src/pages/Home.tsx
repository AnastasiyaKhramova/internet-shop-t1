import { useEffect } from "react"
import Catalog from "../components/Catalog"
import Faq from "../components/Faq"
import Footer from "../components/Footer"
import Header from "../components/Header"
import Main from "../components/Main"

function Home() {
  useEffect(() => {
    document.title = 'Catalog | Goods4you';
  }, []);
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
