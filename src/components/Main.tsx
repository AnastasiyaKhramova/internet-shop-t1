import Button from "./Button"

function Main() {
    return (
        <>
            <main className='container'>
                <div className='second-container'>
                    <div className='main'>
                        <h1 className='main__title'>Any products from famous brands <br /> with worldwide delivery</h1>
                        <p className='main__subtitle'>We sell smartphones, laptops, clothes, shoes <br /> and many other products at low price</p>
                        <Button href="#catalog" aria-label="Go to catalog" btnName="Go to shopping" width="207px" />
                    </div>
                </div>

            </main>
        </>
    )
}

export default Main
