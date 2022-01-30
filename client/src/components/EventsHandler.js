import React, { useEffect, useState } from 'react';
import EventsList from './EventsList';
import EventDetail from './EventDetail';
import httpClients from '../httpClients';

const defaultValuesEvent = {nombre:'',lugar:'',direccion:'',fecha_inicio:'',fecha_fin:'', presencial:false, eventSelected:false}

export default function EventsHandler(props) {
    const [selectedEvent, setSelectedEvent] = useState(defaultValuesEvent)
    const [deletedElement, setDeletedElement] = useState(false)

    const cerrarSesion = async () =>{
        httpClients.post('//localhost:5000/logout').then(() =>{
            props.setLoggedIn(false)
        }).catch((error)=>{
            console.log('error al cerrar sesión')
        })
    }

    return (
        <div>
            <h1 className="ui teal header middle center aligned">
                <div className="content">
                    Bienvenido a tu cuenta de Eventos
                </div>
            </h1>
        <div className='ui grid'>
            <div className='ui segment'>
                <h2 className=" aligned icon header">
                    <i className="user icon"></i>
                    {(props.userInfo)? props.userInfo.name + " " + props.userInfo.lastName : ""}
                </h2>
            </div>
            <div className='ui row'>
                <div className= 'ui segment eight wide column'>
                    <h4 class="ui dividing header">Lista de Eventos</h4>
                    <EventsList setSelectedEvent ={setSelectedEvent} deletedElement={deletedElement} setDeletedElement={setDeletedElement} userInfo={props.userInfo}/>
                </div>
                <div className = 'eight wide column'>
                    <EventDetail selectedEvent={selectedEvent} deletedElement={deletedElement} setDeletedElement={setDeletedElement}/>
                    <h3 onClick={() => cerrarSesion()} className='ui right aligned header'>
                        <i className="log out icon"></i>
                        Cerrar Sesión
                    </h3>
                </div>
                
            </div>
        </div>
        </div>
    )
}

