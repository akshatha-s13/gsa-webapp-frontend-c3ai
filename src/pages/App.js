import React, {useState, useEffect, useReducer} from "react";
import {
  BrowserRouter as Router, Switch, Route, Redirect
} from "react-router-dom";
import './App.css';
import axios from 'axios'
import Signin from "./Signin";
import Signup from "./Signup";
import ManageGroups from "./ManageGroups";
import ManageUsers from "./ManageUsers";
import Profile from "./Profile";
import Navbar from "../components/Navbar";
import Tool from "./Tool";
import ExperimentView from "./ExperimentView";
import toolReducer, {toolDefaultState} from "../reducers/toolReducer";
import userReducer, {userDefaultState} from "../reducers/userReducer";
import { showAlert } from '../components/CustomAlert';

export const GlobalContext = React.createContext();

const App = () => {
  const [toolState, toolDispatch] = useReducer(toolReducer, toolDefaultState)
  const [userState, userDispatch] = useReducer(userReducer, userDefaultState)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const flashSuccess = (text) => {
    let msg =
      <div
        className='w-full bg-green-400 rounded text-center text-green-100 font-bold text-2xl py-2 mb-4'>
        {text}
      </div>
    setSuccessMsg(msg)
    setTimeout(() => {
      setSuccessMsg(null)
    }, 5000)
  }
  const flashError = (text) => {
    let msg =
      <div
        className='w-full bg-red-600 rounded text-center text-green-100 font-bold text-2xl py-2 mb-4'>
        {text}
      </div>
    setErrorMsg(msg)
    setTimeout(() => {
      setErrorMsg(null)
    }, 5000)
  }
  useEffect(() => {
      const trySignIn = async () => {
        const token = window.localStorage.getItem('token');
        if (token) {
          try {
            // check
            const response = await axios.post(
              process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/User', 
              {}, 
              {
                  params: {
                      'action': 'fetch'
                  },
                  headers: {
                      'authorization': 'Bearer '+  window.localStorage.getItem('token'),
                      'accept': 'application/json', //xml
                      'content-type': 'application/json'
                  }
              } 
            );
            if(response.status!==200)
            {
              showAlert("Sign in again")
            }
          } catch (e) {
            if (e.response && e.response.status === 401)
             showAlert('Signed out')
            userDispatch({type: 'SIGN_OUT'})
            window.localStorage.removeItem('token')
          }
        } else {
          userDispatch({type: 'SIGN_OUT'})
        }
      }
      trySignIn();
    }, []
  )

  const RequireAuth = (Component) => {
    return (props) => {
      return (
        userState.signedIn
        ? <Component {...props} />
        : <Redirect to="/signin" />
      )
    }
  }

  return (
    <GlobalContext.Provider
      value={{userState, userDispatch, flashSuccess, flashError, toolState, toolDispatch}}
    >
      <Router>
        <Navbar/>
        {successMsg}
        {errorMsg}
        <Switch>
          <Route exact path='/'>
            <Signin/>
          </Route>
          <Route path='/signin'>
            <Signin/>
          </Route>
          <Route path='/signup'>
            <Signup/>
          </Route>
          <Route exact path='/tool'>
            {RequireAuth(Tool)}
          </Route>
          <Route path='/tool/experiments'>
            {RequireAuth(ExperimentView)}
          </Route>
          <Route path='/profile'>
            {RequireAuth(Profile)}
          </Route>
          <Route path='/managegroups'>
            {RequireAuth(ManageGroups)}
          </Route>
          <Route path='/manageusers'>
            {RequireAuth(ManageUsers)}
          </Route>
        </Switch>
        <div className='h-96'/>
      </Router>
    </GlobalContext.Provider>
  );
}

export default App;
