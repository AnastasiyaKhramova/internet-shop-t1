import Header from "../components/Header"
import SingIn from "../components/SignIn"
import { useEffect } from "react";

function Login() {
    useEffect(() => {
        document.title = 'Login | Goods4you';
    }, []);
    return (
        <div>
            <Header isHidden = {true}/>
            <SingIn />
        </div>
    )
}

export default Login
