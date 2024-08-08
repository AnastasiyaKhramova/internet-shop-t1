import plus from '../assets/img/plus.png'

function Faq() {
    return (
        <>
            <section id="faq" className="container">
                <div className="faq">
                    <div><h2 className="faq__title">FAQ</h2>
                        <details className="faq__details" aria-expanded="false">
                            <summary>
                                How can I track the status of my order?
                                <img className="faq__icon" src={plus} aria-hidden="true" alt="plus" />
                            </summary>
                            After placing your order, you will receive a confirmation email containing your order number and a tracking link. You can also log in to your account on our website and go to the "My Orders" section to track your delivery status.
                        </details>
                        <details className="faq__details" aria-expanded="false">
                            <summary>
                                What payment methods do you accept?
                                <img className="faq__icon" src={plus} aria-hidden="true" alt="plus" />
                                </summary>After placing your order, you will receive a confirmation email containing your order number and a tracking link. You can also log in to your account on our website and go to the "My Orders" section to track your delivery status.
                        </details>
                        <details className="faq__details" aria-expanded="false">
                            <summary>
                                How can I return or exchange an item?<img className="faq__icon" src={plus} aria-hidden="true" alt="plus" /></summary>After placing your order, you will receive a confirmation email containing your order number and a tracking link. You can also log in to your account on our website and go to the "My Orders" section to track your delivery status.
                        </details></div>
                </div>
            </section>
        </>
    )
}

export default Faq
