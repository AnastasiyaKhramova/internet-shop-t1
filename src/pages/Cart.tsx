import { useEffect } from "react";
import Footer from "../components/Footer"
import Header from "../components/Header"
import MyCart from "../components/MyCart"

function Cart() {
    useEffect(() => {
        document.title = 'My cart | Goods4you';
    }, []);
    return(
        <div>
            <Header />
            <MyCart />
            <Footer />
        </div>
    )
}

export default Cart
