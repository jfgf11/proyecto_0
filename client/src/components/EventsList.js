import React from 'react'
import { useEffect, useState } from "react";
import httpClients from '../httpClients';
import EventItem from './EventItem';


export default function EventsList(props) {
    const [listEvents, setListEvents] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    

    useEffect(() => {
        httpClients.get('//localhost:5000/events/'+currentPage).then((events) => {
            setListEvents(events.data)
        })
    }, [currentPage, props.deletedElement])

    const renderedList = listEvents.map((event) => {
        return <EventItem key={event.id} event={event} deletedElement={props.deletedElement} setDeletedElement={props.setDeletedElement} setSelectedEvent={props.setSelectedEvent}/>
    })

    return (
        <div className="ui relaxed divided list">
            {renderedList}
            <div class='ui grid'>
                <div class='ui row center aligned'>
                    
                    <div class='column middle'>
                        <i onClick={()=>{
                            if (currentPage > 0){
                                setCurrentPage(currentPage-1)
                            }
                        }}class="five wide column arrow left icon"></i>
                        Current Page: {currentPage}  
                        <i onClick={()=>{
                            setCurrentPage(currentPage+1)
                        }} class="one wide column arrow right icon"></i>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
