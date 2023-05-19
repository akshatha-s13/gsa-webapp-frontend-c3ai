import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Redirect} from 'react-router'
import * as crypto from "crypto";
import { showAlert } from '../components/CustomAlert';

const Signup = () => {
  const [addNewInstitution, setAddNewInstitution] = useState(false)
  const [newInstitution, setNewInstitution] = useState('')
  const [institutionOptions, setInstitutionOptions] = useState([])
  const [institution, setInstitution] = useState('')
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [signedUp, setSignedUp] = useState(false)
  
  const getC3KeyTokenGenerator = function () {
    const pvtKey = process.env.REACT_APP_C3_ADMIN_KEY;
    const adminUser = process.env.REACT_APP_C3_ADMIN_USER;
    const signAlgo = 'RSA-SHA512';
    const signatureText = Date.now().toString();
    const signer = crypto.createSign(signAlgo);
    signer.update(signatureText);
    const signature = signer.sign(pvtKey, 'base64');
    const tokenString = adminUser + ":" + Buffer.from(signatureText).toString('base64') + ":" + signature;
    const authToken = "c3key " + Buffer.from(tokenString).toString('base64');
    //console.log("Generated new token: " + authToken);
    return authToken;
  };

  useEffect(() => {
    const getInstitutions = async () => {
      try {
        const token = getC3KeyTokenGenerator();
        const response = await axios.post(
          process.env.REACT_APP_C3_URL+'/oauth/token', 
          new URLSearchParams({
                  'grant_type': 'client_credentials'
              }),
          {
              headers: {
                  'authorization': token
              }
          }
        );  
        window.localStorage.setItem('adminToken', response.data.access_token)

        const response1 = await axios.post(
            process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Author', 
            {spec: {projection: 'unique(institution)'}},
            {
                params: {
                    'action': 'evaluate'
                },
                headers: {
                    'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                    'accept': 'application/json', //xml
                    'content-type': 'application/json'
                }
            }
        );  
        if(response1.data.count>0)
        {
        const data = response1.data.tuples.map((obj) => obj.cells[0].str).filter(obj => obj !== "UIUC" && obj !== "uiuc-test"); 
        setInstitutionOptions(data)
        setInstitution(data[0])
        }       
      } 
      catch (err) 
      {
       showAlert(err) // change to error message
      }
    }
    getInstitutions()
  }, [])

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passwordRegex.test(password);
  };  

  const onClickSignUpBtn = async (e) => {
    e.preventDefault()
    if (email === '') {
     showAlert('Email field is empty.')
      return
    }
    if (password === '') {
     showAlert('Password field is empty.')
      return
    }
    if (firstname === '') {
     showAlert('First Name field is empty.')
      return
    }
    if (lastname === '') {
     showAlert('Last Name field is empty.')
      return
    }
    if (addNewInstitution && newInstitution === '') {
     showAlert('Institution field is empty.')
      return
    }
    if (email !== email2) {
     showAlert('Emails do not match.')
      return
    }
    if (password !== password2) {
     showAlert('Passwords do not match.')
      return
    }
    if (!isValidPassword(password))
    {
     showAlert('The password must be between 8 and 20 characters and contain at least one uppercase character, one lowercase character and one digit')
      return
    }
    try {
      const inst = addNewInstitution ? newInstitution : institution;
      
      const response0 = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/User', 
        {spec: {filter:"id=='"+email+"'"}}, 
        {
            params: {
                'action': 'fetch',
            },
            headers: {
                'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        }
      );
      //console.log(response0.data)
      if(response0.data.count!=0)
      {
       showAlert('User exists.')
        return
      }

      const response = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/GrdbIdentityManager', 
        '', 
        {
            params: {
                'action': 'createAuthorUser',
                'email': email,
                'firstname': firstname,
                'lastname': lastname,
                'username': email,
                'institution': inst 
            },
            headers: {
                'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                'accept': 'application/xml',
                'content-type': 'application/xml'
            }
        }
      );
      if(response.status!=200)
      {
       showAlert("Sign Up failed. Try again")  // change 
      }
      const response1 = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/GrdbIdentityManager', 
        '', 
        {
            params: {
                'action': 'setPassword',
                'username': email,
                'password': password
            },
            headers: {
                'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                'accept': 'application/xml',
                'content-type': 'application/xml'
            }
        }
      );
      //console.log(response1)
      if(response1.status==200)
      {
       showAlert("Signed Up. Please sign in")
        setSignedUp(true)
      }
      else{
       showAlert()
      }
    } catch (err) {
      if(err){
      //console.log(err.message) // change to log file
     showAlert("Error connecting. Please refresh or try again after some time.")
    }
    }
  }

  if (signedUp) {
    return <Redirect to='/'/>
  }

  return (
    <form className='md:w-1/2 flex flex-col md:items-center mx-auto border rounded my-6 py-6'
          onSubmit={onClickSignUpBtn}>
      <h2 className='text-center text-3xl font-bold mb-6'>Sign Up</h2>
      <div className="md:w-full md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="email">
            Email
          </label>
        </div>
        <div className="md:w-1/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="email" type="email" placeholder="Email"
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
                 htmlFor="email2">
            Confirm Email
          </label>
        </div>
        <div className="md:w-1/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="email2" type="email" placeholder="Email"
            value={email2}
            onChange={e => {
              setEmail2(e.target.value)
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
      <div className="md:w-full md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="password2">
            Confirm Password
          </label>
        </div>
        <div className="md:w-1/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="password2" type="password" placeholder="********"
            value={password2}
            onChange={e => {
              setPassword2(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="md:w-full md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="firstname">
            First Name
          </label>
        </div>
        <div className="md:w-1/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="firstname" type="text" placeholder="First Name"
            value={firstname}
            onChange={e => {
              setFirstname(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="md:w-full md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="lastname">
            Last Name
          </label>
        </div>
        <div className="md:w-1/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="lastname" type="text" placeholder="Last Name"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
          />
        </div>
      </div>
      {addNewInstitution ||
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="lastname">
              Institution
            </label>
          </div>
          <div className="md:w-1/3 relative">
            <select
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              value={institution}
              onChange={e => {
                setInstitution(e.target.value)
              }}
            >
              {institutionOptions.map((school, i) => {
                return <option key={i}>{school}</option>
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>}
      <div className="mx-auto md:flex md:items-center mb-6">
        <label className="block text-black md:text-right mb-1 md:mb-0 pr-4"
               htmlFor="lastname">
          Can't see your institution?
        </label>
        <input type='checkbox'
               onChange={e => setAddNewInstitution(e.target.checked)}
        />
      </div>
      {addNewInstitution &&
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="lastname">
              Institution
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="new-institution" type="text" placeholder="New Institution"
              value={newInstitution}
              onChange={e => {
                setNewInstitution(e.target.value)
              }}
            />
          </div>
        </div>
      }
      <button
        className='self-center w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5'
        type='submit'>
        Sign Up
      </button>
    </form>
  )
}

export default Signup
