import React from 'react';
import httpClients from '../httpClients';
import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import { Link } from 'react-router-dom';


const RegisterPage = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");


    const registerUser = async () => {
        httpClients.post("//172.24.41.232:8080/registro", {
            "email" : email,
            "password" : password,
            "name" : name,
            "lastName" : lastName
        }).then((resp)=>{
            sessionStorage.setItem('token', resp.data.access_token)
            props.setToken(resp.data.access_token)
        }).catch(()=>{
            props.setToken('')
            alert('Error creando usuario')
        })
    };



    return (
        <div className="ui  grid">
            <div className='column'>
                    <h2 className="ui teal header middle center aligned">
                        <div className="content">
                            Crea tu nueva cuenta de Eventos
                        </div>
                    </h2>
                <form className="ui form segment">
                    <div className="field">
                        <label>Nombre</label>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" name="first-name" placeholder="Nombre" style={{width:1000}}/>
                    </div>
                    <div className="field">
                        <label>Apellido</label>
                        <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" name="last-name" placeholder="Last Name"/>
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" name="last-name" placeholder="Email"/>
                    </div>
                    <div className="field">
                        <label>Contraseña</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} type="text" name="last-name" placeholder="Contraseña"/>
                    </div>
                    <div className='ui segment'>
                        <div className='field'>
                            <button onClick={()=>registerUser()} className="ui center aligned button" type='button'>Registrarse</button>
                        </div>
                        <div className='ui right aligned'>
                            <Link to='/'><button  className="ui center aligned button" type="submit">Atras</button></Link>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;