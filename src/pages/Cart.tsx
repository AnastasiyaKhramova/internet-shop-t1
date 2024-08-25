import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"
import Header from "../components/Header"
import MyCart from "../components/MyCart"
import { getToken } from "../utils/auth";

function Cart() {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'My cart | Goods4you';
        const token = getToken();
        if (!token) {
            navigate('/login'); 
        }
    }, [navigate]);
    return(
        <div>
            <Header />
            <MyCart />
            <Footer />
        </div>
    )
}

export default Cart
