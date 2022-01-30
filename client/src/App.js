import {BrowserRouter, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import httpClients from "./httpClients";
import EventsHandler from "./components/EventsHandler";

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  

  useEffect(()=>{
    httpClients.get('//localhost:5000/@me').then((response)=>{
      setLoggedIn(true);
      setUserInfo(response.data)
    }).catch((e)=>{
      setLoggedIn(false);
      setUserInfo(null);
    })
  }, [loggedIn]);



  return (
    <div className={'container_center'}>
      {loggedIn===false?(
        <BrowserRouter>
          <Route path="/" exact render={() => <LoginPage setLoggedIn={setLoggedIn}/>}/>
          <Route path='/register' exact render = {() => <RegisterPage setLoggedIn={setLoggedIn}/>}/>
          {/* <Route exact component={NotFound}/> */}
        </BrowserRouter>
      ):
        <BrowserRouter>
          <Route path="/" render={() => <EventsHandler setLoggedIn={setLoggedIn} userInfo={userInfo}/>}/>
        </BrowserRouter>
    }
    </div>
  );
}

export default App;
