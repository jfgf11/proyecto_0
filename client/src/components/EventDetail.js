import React, {useState, useEffect} from 'react'
import httpClients from '../httpClients'

export default function EventDetail(props) {
    const [nombre, setNombre] = useState('')
    const [lugar, setLugar] = useState('')
    const [direccion, setDireccion] = useState('')
    const [fecha_inicio, setfecha_inicio] = useState('')
    const [fecha_fin, setfecha_fin] = useState('')
    const [presencial, setPresencial] = useState(false)
    const [eventSelected, setEventSelected] = useState(false)
    const [categoria, setCategoria] = useState('Conferencia')

    useEffect(() => {
        setNombre(props.selectedEvent.nombre)
        setLugar(props.selectedEvent.lugar)
        setDireccion(props.selectedEvent.direccion)
        setfecha_inicio(props.selectedEvent.fecha_inicio.substr(0,10))
        setfecha_fin(props.selectedEvent.fecha_fin.substr(0,10))
        setPresencial(props.selectedEvent.presencial)
        setEventSelected(props.selectedEvent.eventSelected)
        if (props.selectedEvent.categoria){
            setCategoria(props.selectedEvent.categoria)
        }else{
            setCategoria('Conferencia')
        }
        
    }, [props.selectedEvent])


    const modificarEvento = async () => {
        
        httpClients.put('//172.24.41.232:8080/event/'+props.selectedEvent.id,{
            nombre: nombre,
            lugar: lugar,
            direccion: direccion,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            presencial: presencial,
            categoria: categoria
        },{
            headers: {
              'Authorization': "Bearer " + props.token
            }
        }).then(()=>{
            props.setDeletedElement(!props.deletedElement)
        }).catch(() =>{
            console.log('Error al editar')
            console.log(categoria)
        })
    }

    const crearEvento = async () => {
        
        httpClients.post('//172.24.41.232:8080/events/1',{
            nombre: nombre,
            lugar: lugar,
            direccion: direccion,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            presencial: presencial,
            categoria: categoria
        },{
            headers: {
              'Authorization': "Bearer " + props.token
            }
        }).then(()=>{
            props.setDeletedElement(!props.deletedElement)
        }).catch(() =>{
            alert('Error al crear evento, llene todos los campos')
        })
    }


    return (
        <div className='ui segment'>
            <div className='ui form'>
                <h4 class="ui dividing header">Información del Evento</h4>
                <div class="field">
                    
                    <div class="field">
                        <label>Nombre del Evento</label>
                        <input type="text" value={nombre} onChange = {(e) => setNombre(e.target.value)} placeholder="Nombre Evento"/>
                    </div>




                <div class="field">
                    <label>Categoría</label>
                    <select value={categoria} onChange={(e)=>{setCategoria(e.target.value)}} style={{cursor: 'pointer'}}>
                        <option value='Conferencia'>Conferencia</option>
                        <option value='Seminario'>Seminario</option>
                        <option value='Congreso'>Congreso</option>
                        <option value='Curso'>Curso</option>
                    </select>
                </div>


                </div>
                <div class='two fields'>
                    <div class='field'>
                        <label> Ciudad</label>
                        <input type="text" value={lugar} onChange = {(e) => setLugar(e.target.value)} placeholder="Ciudad Evento"/>
                    </div>
                    <div class='field'>
                        <label> Dirección</label>
                        <input type="text" value={direccion} onChange = {(e) => setDireccion(e.target.value)} placeholder="Dirección Evento"/>
                    </div>
                </div>
                <div class='two fields'>
                    <div class='field'>
                        <label> Fecha Inicio</label>
                        <input type="text" pattern="\d{1,2}/\d{1,2}/\d{4}" value={fecha_inicio} type='date' onChange = {(e) => setfecha_inicio(e.target.value)} placeholder="Fecha Inicio"/>
                    </div>
                    <div class='field'>
                        <label> Fecha Fin</label>
                        <input type="text" pattern="\d{1,2}/\d{1,2}/\d{4}" value={fecha_fin} type='date' onChange = {(e) => setfecha_fin(e.target.value)} placeholder="Fecha Fin"/>
                    </div>
                </div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui toggle checkbox">
                            <input checked={presencial} onClick={(e)=>setPresencial(e.target.checked)} type="checkbox" />
                            <label>El evento requiere de presencialidad?</label>
                        </div>
                    </div>
                </div>
                <div class='two fields'>
                    <div class='field'>
                        {eventSelected==true? (<div onClick={() => modificarEvento()} class="ui button" tabindex="0">Modificar Evento</div>):(<div></div>)}
                    </div>
                    <div class='field'>
                        <div class="ui positive button" onClick={() => crearEvento()} tabindex="0">Crear Nuevo Evento</div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}
