import React, {useState, useContext} from 'react'
import {Redirect} from 'react-router'
import {GlobalContext} from './App'
import axios from 'axios'
import { showAlert } from '../components/CustomAlert';

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const g = useContext(GlobalContext)

  const onClickSignInBtn = async (e) => {
    e.preventDefault()
    try {
          const response = await axios.post(
            process.env.REACT_APP_C3_URL+'/oauth/token', 
            new URLSearchParams({
                'grant_type': 'client_credentials'
            }),
            {
                auth: {
                    username: email,
                    password: password 
                }
            }
          );
        
          window.localStorage.setItem('token', response.data.access_token)
          
          const response1 = await axios.post(
            process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/User', 
            {spec: {filter:"id=='"+email+"'"}}, 
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
          if(response1.status===200){
            // to get author id
            const response2 = await axios.post(
              process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Author', 
              {spec: {filter:"user=='"+email+"'"}}, 
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
            //console.log(response1)
            var authorId = null;
            if(response2.data.count>0){
              authorId = response2.data.objs[0].id;
              //console.log(authorId)
            }
            var isModerator = false;
            var isAdmin = false;
            response1.data.objs[0].groups.forEach(group => {
              if(group.id.includes("Admin"))
              {
                isAdmin = true;
              }
              if(group.id.includes("Moderator"))
              {
                isModerator = true;
              }
            });

            const payload = {
              userId: response1.data.objs[0].id,
              authorId: authorId, //##change response1.data.count>0: response1.data.objs[0].id
              isAdmin: isAdmin,
              isModerator: isModerator,
            }
            g.userDispatch({type: 'SIGN_IN', payload})
          }
        } catch (err) {
        // add specific error codes
        //console.log(err)
       showAlert("Incorrect email or password or no access permission.")
      }
  }

  if (g.userState.signedIn) {
    return <Redirect to='/tool'/>
  }
  return (<form className='md:w-1/2 flex flex-col md:items-center mx-auto border rounded my-6 py-6'
                onSubmit={onClickSignInBtn}>
    <h2 className='text-center text-3xl font-bold mb-6'>Sign In</h2>
    <div className="md:w-full md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
               htmlFor="email" id="email-label">
          Email
        </label>
      </div>
      <div className="md:w-1/3">
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="email" type="email" placeholder="Email" autoComplete="on"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
      </div>
    </div>
    <div className="md:w-full md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
               htmlFor="password">
          Password
        </label>
      </div>
      <div className="md:w-1/3">
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="password" type="password" placeholder="********"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
      </div>
    </div>
    <button
      className='self-center w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5'
      type='submit'>
      Sign In
    </button>
  </form>)
}

export default Signin
