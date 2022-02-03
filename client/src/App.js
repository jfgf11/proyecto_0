import {BrowserRouter, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import httpClients from "./httpClients";
import EventsHandler from "./components/EventsHandler";

// Context


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [token, setToken] = useState('')

  useEffect( ()=>{
    const newToken = sessionStorage.getItem('token')
    if (newToken && newToken != "" && newToken != undefined) setToken(newToken)
    httpClients.get('//172.24.41.232:8080/@me', {
      headers: {
        'Authorization': "Bearer " + newToken
      }
    }).then((response)=>{
      setUserInfo(response.data)
    }).catch((e)=>{
      setUserInfo(null);
    })
  }, [token]);



  return (
    
    <div className={'container_center'}>
      {token==='' || token===undefined || !token?( 
        <BrowserRouter>
          <Route path="/" exact render={() => <LoginPage setToken={setToken}/>}/>
          <Route path='/register' exact render = {() => <RegisterPage setToken={setToken}/>}/>
          {/* <Route exact component={NotFound}/> */}
        </BrowserRouter>
      ):
        <BrowserRouter>
          <Route path="/" render={() => <EventsHandler token={token} setToken={setToken} userInfo={userInfo}/>}/>
        </BrowserRouter>
    }
    </div>
  );
}

export default App;
