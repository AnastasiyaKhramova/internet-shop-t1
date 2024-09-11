import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import errorImg from '../assets/img/error.jpg';

function ErrorPage({ errorCode }: { errorCode?: number }) {
  const [errorMessage, setErrorMessage] = useState("Unexpected error");

  useEffect(() => {
    document.title = 'Error | Goods4you';
    if (errorCode === 404) {
      setErrorMessage("Page does not exist");
    } else if (errorCode === 500) {
      setErrorMessage("Internal server error");
    }
  }, [errorCode]);

  return (
    <>
      <Header />
      <div className="error-page">
        {errorCode === 404 && (
          <img className="error-img" src={errorImg} alt="error" />
        )}
        {errorCode === 500 && (
          <h2 className="error-message">{errorMessage}</h2>
        )}

      </div>
      <Footer />
    </>
  );
}

export default ErrorPage;
