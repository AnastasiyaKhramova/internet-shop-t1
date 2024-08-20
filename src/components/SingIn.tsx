import Button from "./Button"

function SingIn() {
  const handleSignIn = () => {

  }
  return (
    <div>
      <section className="second-container registration">
        <h1 className="registration__title">Sign in</h1>
        <form className="registration__form">
          <input className="catalog__find"
            type="text"
            placeholder="Login"
            aria-label="Input Login"
            onChange={(e) => e.target.value} />
          <input className="catalog__find"
            type="text"
            placeholder="Password"
            aria-label="Input Password"
            onChange={(e) => e.target.value} />
          <Button
            btnName="Sign in"
            aria-lable="Sign in"
            onClick={handleSignIn}
          />
        </form>
      </section>
    </div>
  )
}

export default SingIn
