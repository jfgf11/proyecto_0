import React, {useState} from 'react';
import httpClients from '../httpClients';
import {Link} from 'react-router-dom';
import AppContext from '../context/User/UserContext';




const LoginPage = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const loginUser = async () => {
        httpClients.post("//172.24.41.232:8080/login", {
            email,
            password,
        }).then((resp) => {
            sessionStorage.setItem('token', resp.data.access_token)
            props.setToken(resp.data.access_token)
        }).catch((e) => {
            props.setToken('')
            alert('Credenciales Invalidas')
        })
    };

    return (

    <div className="ui middle center aligned grid">
        <div className="column">
            <h2 className="ui teal header">
                <div className="content">
                    Log-in a tu cuenta de Eventos
                </div>
            </h2>
            <form className="ui large form">
                <div className="ui stacked segment">
                    <div className="field">
                        <div className="ui left icon input">
                            <i className="user icon"></i>
                            <input type="text" name="email" placeholder="E-mail" value={email} onChange={(e)=> setEmail(e.target.value)} style={{width:700}}/>
                        </div>
                    </div>
                    <div className="field">
                        <div className="ui left icon input">
                            <i className="lock icon"></i>
                            <input type="password" name="password" placeholder="Contraseña" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div onClick={() => loginUser()} className="ui fluid large teal submit button">Login</div>
                </div>

                <div className="ui error message"></div>

            </form>

            <div className="ui message">
            No tienes cuenta? <Link to='/register'>Regístrate</Link>
            </div>
        </div>
    </div>

    )
}

export default LoginPage;

