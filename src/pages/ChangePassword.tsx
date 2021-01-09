import React from 'react'
import {FiArrowLeft} from 'react-icons/fi'
import {Link} from 'react-router-dom'

import logoImg from '../images/logoTipo2.svg'

function Login() {

  return(
    <div id="page-login" className="forgot-password-page">
      <div className="landing-content">
        <img src={logoImg} alt="Happy" />

        <div className="location">
            <strong>Hortolândia</strong>
            <span>São Paulo</span>
        </div>
      </div>

      <main>
        <Link className="back-page" to="/login">
            <FiArrowLeft size={26} color="rgba(21, 195, 214, 1)"></FiArrowLeft>
        </Link>

        <form className="login-form">
          <fieldset>
            <legend>Esqueci a senha</legend>
            <p>Sua redefinição de senha será enviado para o email cadastrado</p>

            <div className="input-block">
              <label htmlFor="email">Email</label>
              <input id="email" />
            </div>

          </fieldset>

          <button disabled={ true } className="confirm-button" type="submit">
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;