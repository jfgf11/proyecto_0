import React from 'react'
import { useEffect, useState } from "react";
import httpClients from '../httpClients';
import EventItem from './EventItem';


export default function EventsList(props) {
    const [listEvents, setListEvents] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    

    useEffect(() => {
        httpClients.get('//172.24.41.232:8080/events/'+currentPage,{
            headers: {
              'Authorization': "Bearer " + props.token
            }
        }).then((events) => {
            setListEvents(events.data)
        })
    }, [currentPage, props.deletedElement])

    const renderedList = listEvents.map((event) => {
        return <EventItem token={props.token} key={event.id} event={event} deletedElement={props.deletedElement} setDeletedElement={props.setDeletedElement} setSelectedEvent={props.setSelectedEvent}/>
    })

    return (
        <div>
            <div className="ui relaxed divided list" style={{height:'400px'}}>
                {renderedList}
            </div>
            
            <div className='ui grid' style={{diplay:'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                <div className='ui row center aligned'>
                    
                    <div style={{diplay:'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <i onClick={()=>{
                            if (currentPage > 0){
                                setCurrentPage(currentPage-1)
                            }
                        }}className="five wide column arrow left icon" style={{width:'20px', cursor: 'pointer'}}></i>
                        Current Page: {currentPage + 1}  
                        <i onClick={()=>{
                            setCurrentPage(currentPage+1)
                        }} style={{width:'20px', cursor: 'pointer'}} className="one wide column arrow right icon"></i>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
