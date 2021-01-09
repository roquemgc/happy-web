import React, { useEffect, useState, FormEvent } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import storageProvider from '../services/storageProvider'
import AuthenticationService from '../services/authenticationService'

import {FiArrowLeft} from 'react-icons/fi';
import logoImg from '../images/logoTipo2.svg'
import '../styles/pages/handle-user.css'

function HandleUser() {

  const location = useLocation();
  const history = useHistory();
  const [login, setLogin] = useState(false);
  const [forgotPassword, setforgotPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [formLegend, setFormLegend] = useState('')
  const [formInstruction, setFormInstruction] = useState('')

  const [email, setEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const auth = new AuthenticationService();

  useEffect(() => {
    if(location.pathname === '/login') {
      setFormLegend('Fazer login');
      setLogin(true);
  
    } else if(location.pathname === '/forgot-password') {
      setFormLegend('Esqueci a senha');
      setFormInstruction('Sua redefinição de senha será enviado para o email cadastrado');
      setforgotPassword(true);
  
    } else if(location.pathname === '/password-reset') {
      setFormLegend('Redefinição de senha');
      setFormInstruction('Escolha uma nova senha para você acessar o dashboard do Happy');
      setPasswordReset(true);
    }
  }, [location.pathname]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const jwt = await auth.doLogin(email, userPassword);
      const isUserValid = storageProvider.saveJwt(jwt)

      isUserValid.then(() => {
        // Se a promisse for fullFilled irá prosseguir
        history.push('/dashboard')
      }).catch(() => {
        // Se a promisse for rejected ira cair no catch
        alert('Usuário ou senha incorretos');
      })
    } catch (error) {
      console.log(error);
    }
  }


  return(
    <div id="page-handle-user">
      <div className="landing-content">
        <img src={logoImg} alt="Happy" />

        <div className="location">
            <strong>Hortolândia</strong>
            <span>São Paulo</span>
        </div>
      </div>
      <main>
        { (login || forgotPassword) &&(
          <button type="button" className="back-page" onClick={() => history.push('/')}>
            <FiArrowLeft size={26} color="rgba(21, 195, 214, 1)"></FiArrowLeft>
          </button>
        )}
        <form onSubmit={handleSubmit} className="user-form">
          <fieldset>
            <legend>{formLegend}</legend>
            { (forgotPassword || passwordReset) && (
              <p>{formInstruction}</p>
            ) }

            {login ? (
              // Interface para o login
              <>
                <div className="input-block">
                  <label htmlFor="email">Email</label>
                  <input type="text" id="email" onChange={event => setEmail(event.target.value)} />
                </div>
                <div className="input-block">
                  <label htmlFor="password">Senha</label>
                  <input type="password" id="password" onChange={event => setUserPassword(event.target.value)}/>
                </div>
                <div className="input-block input-checkbox">
                    <label htmlFor="remind-me">                  
                      <input type="checkbox" id="remind-me"/>
                      <span className="checkmark"></span>
                      Lembrar-me   
                    </label>
                </div>
                <Link id="forgot-password" to="/forgot-password">
                  Esqueci minha senha
                </Link> 
              </>
            ) : forgotPassword ? (
              // Interface para esqueci a senha
              <div className="input-block">
                <label htmlFor="email">Email</label>
                <input id="email" />
              </div>
            ) : passwordReset && (
              // Interface para a mudança de senha
              <>
                <div className="input-block">
                  <label htmlFor="password">Senha</label>
                  <input type="password" id="password" />
                </div>
                <div className="input-block">
                  <label htmlFor="passwordConfirmation">Repetir senha</label>
                  <input type="password" id="passwordConfirmation" />
                </div>
              </>
            )}
            <button disabled={ false } className="confirm-button" type="submit">
              Entrar
            </button>

          </fieldset>
        </form>
      </main>
    </div>
  );
}

export default HandleUser;