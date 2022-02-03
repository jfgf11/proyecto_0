import React from 'react'
import httpClients from '../httpClients'

export default function EventItem(props) {
    var event = props.event

    const deleteEvent = async () => {
        httpClients.delete('//172.24.41.232:8080/event/'+event.id,{
            headers: {
              'Authorization': "Bearer " + props.token
            }
        }).then(()=>{
            props.setDeletedElement(!props.deletedElement)
        }).catch(() =>{
            console.log('Error deleted')
        })
    }


    return (
    <div className="item">
        <div className="right floated content">
            <div onClick={() => deleteEvent()} className="ui negative button">Eliminar</div>
        </div>
        <i className="large github middle aligned icon"></i>
        <div className="content">
        <a className="header" onClick={() => {
            event.eventSelected=true
            props.setSelectedEvent(event)
            }}>{event.nombre}</a>
        <div className="description">Fecha Inicio: {event.fecha_inicio.substr(0,10)}</div>
        </div>
    </div>
    )
}
