import axios from 'axios'
import React, {useState, useEffect, useContext, useRef} from 'react'
import {Redirect} from "react-router-dom";
import {GlobalContext} from "./App";
import ToolSubmit from "../containers/ToolSubmit";
import Sidebar from "../components/Sidebar";
import LoadingPage from "../components/LoadingPage";
import SearchByEnvironmentCondition from "../components/GrresqQueryBox/SearchByEnvironmentCondition";
import SearchFilters from "../containers/SearchFilters";
import SearchByFurnace from "../components/GrresqQueryBox/SearchByFurnace";
import SearchBySubstrate from "../components/GrresqQueryBox/SearchBySubstrate";
import SearchByCharacterization from "../components/GrresqQueryBox/SearchByCharacterization";
import SearchByAuthor from "../components/GrresqQueryBox/SearchByAuthor";
import SearchByRecipe from "../components/GrresqQueryBox/SearchByRecipe"; 
import QueryResultTable from "../containers/QueryResultTable";
import { showAlert } from '../components/CustomAlert';

import * as crypto from "crypto";

import dotenv from 'dotenv';
dotenv.config();

const Tool = () => {
  const {toolState, toolDispatch, flashError} = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false);

  const [showEnvironmentConditions, setShowEnvironmentConditions] = useState(false)
  const [showFurnaces, setShowFurnaces] = useState(false)
  const [showSubstrates, setShowSubstrates] = useState(false)
  const [showRecipes, setShowRecipes] = useState(false)
  const [showProperties, setShowProperties] = useState(false)
  const [showAuthors, setShowAuthors] = useState(false)

  const [mouseOverEnvironmentConditions, setMouseOverEnvironmentConditions] = useState(false)
  const [mouseOverFurnaces, setMouseOverFurnaces] = useState(false)
  const [mouseOverSubstrates, setMouseOverSubstrates] = useState(false)
  const [mouseOverRecipes, setMouseOverRecipes] = useState(false)
  const [mouseOverProperties, setMouseOverProperties] = useState(false)
  const [mouseOverAuthors, setMouseOverAuthors] = useState(false)

  const queryRef = useRef(null)
  const resultRef = useRef(null)
  const submitRef = useRef(null)

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
    const init = async () => {
      const token = getC3KeyTokenGenerator();
      setLoading(true)
      try {
  
        var data = {
          environmentConditions: [], 
          furnaces: [], 
          preparationSteps: [],
          properties: [],
          recipes: [],
          substrates: [],
          authors: [],
          catalysts: [],
          carbonSource: []
        }

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

        //catalyst
        const response1 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(substrate.catalyst)'}},
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                  'accept': 'application/json', 
                  'content-type': 'application/json'
              }
          }
        );  
        if(response1.data.count>0)
        {
          response1.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.catalysts.push(cell.str);
            }
          });
        }
        
        // carbon source
        const response2 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(recipe.carbonSource)'}},
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization':  'Bearer '+  window.localStorage.getItem('adminToken'),
                  'accept': 'application/json', 
                  'content-type': 'application/json'
              }
          }
        );  
        if(response2.data.count>0)
        {
          response2.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.carbonSource.push(cell.str);
            }
          });
        }

        // furnace
        const response3 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(furnace.id)'}},
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('token'),
                  'accept': 'application/json', 
                  'content-type': 'application/json'
              }
          }
        );  
        if(response3.data.count>0)
        {
          response3.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.furnaces.push(cell.str);
            }
          });
        }

        // preparation step - not needed
        // const response4 = await axios.post(
        //   process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
        //   {spec: {projection: 'unique(recipe.preparationSteps.id)'}},
        //   {
        //       params: {
        //           'action': 'evaluate'
        //       },
        //       headers: {
        //           'authorization': 'Bearer '+  window.localStorage.getItem('token'),
        //           'accept': 'application/json', //xml
        //           'content-type': 'application/json'
        //       }
        //   }
        // );  
        // if(response4.data.count>0)
        // {
        //   response4.data.tuples.forEach(obj => {
        //     const cell = obj.cells[0];
        //     if (cell && cell.str) {
        //       data.preparationSteps.push(cell.str);
        //     }
        //   });
        // }
        
        // properties
        const response5 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(properties.id)'}}, 
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('token'),
                  'accept': 'application/json', 
                  'content-type': 'application/json'
              }
          }
        );  
        if(response5.data.count>0)
        {
          response5.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.properties.push(cell.str);
            }
          });
        }

        // recipes
        const response6 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(recipe.id)'}}, 
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('token'),
                  'accept': 'application/json', 
                  'content-type': 'application/json'
              }
          }
        );  
        if(response6.data.count>0)
        {
          response6.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.recipes.push(cell.str);
            }
          });
        }

        // substrates
        const response7 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(substrate.id)'}}, 
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('token'),
                  'accept': 'application/json', 
                  'content-type': 'application/json'
              }
          }
        );  
        if(response7.data.count>0)
        {
          response7.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.substrates.push(cell.str);
            }
          });
        }
        //console.log(response7.data)

        // environmentConditions
        const response9 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
          {spec: {projection: 'unique(environmentConditions.id)'}},
          {
              params: {
                  'action': 'evaluate'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('token'),
                  'accept': 'application/json', //xml
                  'content-type': 'application/json'
              }
          }
        );  
        if(response9.data.count>0)
        {
          response9.data.tuples.forEach(obj => {
            const cell = obj.cells[0];
            if (cell && cell.str) {
              data.environmentConditions.push(cell.str);
            }
          });
        }

        // author
        const response8 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Author', 
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
        if(response8.data.count>0)
        {
        data.authors = response8.data.objs;}

        //console.log(data)
        if (response8.status === 200) {
         //console.log("init done")
          setIsInitialized(true);
          toolDispatch({type: 'INIT', payload: data})
        }
      } catch (e) {
        //console.log(e)
        flashError('Oops. Database connection lost. Retrying...')
        setError(true)
      }
      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    document.getElementById('environment-conditions-btn').innerHTML = showEnvironmentConditions ? '&#8211;' : '+'
  }, [showEnvironmentConditions])
  useEffect(() => {
    document.getElementById('furnace-btn').innerHTML = showFurnaces ? '&#8211;' : '+'
  }, [showFurnaces])
  useEffect(() => {
    document.getElementById('substrate-btn').innerHTML = showSubstrates ? '&#8211;' : '+'
  }, [showSubstrates])
  useEffect(() => {
    document.getElementById('recipe-btn').innerHTML = showRecipes ? '&#8211;' : '+'
  }, [showRecipes])
  useEffect(() => {
    document.getElementById('author-btn').innerHTML = showAuthors ? '&#8211;' : '+'
  }, [showAuthors])
  useEffect(() => {
    document.getElementById('property-btn').innerHTML = showProperties ? '&#8211;' : '+'
  }, [showProperties])

  const fetchExperiments = async () => {
    if (toolState.filters.length === 0) {
     showAlert("There is no selected filter.")
      return
    }
    setLoading(true)
    try {
      var str = ""
      var authList = []
      for(let each of toolState.filters)
      {
        if(each.type === "AUTHOR")
        {
          authList.push(each.id);
          continue;
        }
        const name = each.name
                      .trim() 
                      .split(/\s*\(\s*/)[0]
                      .split(/\s+/) 
                      .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
                      .join('');
        if(each.type === 'MIN_MAX')
        {
          str+=each.category+"."+name+" >= "+each.min+" && "+each.category+"."+name+" <= "+each.max+" && ";
        }
        else if(each.type === "KEY_VALUE")
        {
          //console.log(each)
          if(each.name=== "Inert Gas")
          {
          str+=each.category+".uses"+each.value+" == 'True' && ";
          }
          else{
          str+=each.category+"."+name+" == '"+each.value+"' && ";
          }
        }
      }
      if (authList.length!==0) {
        authList = authList.map(item => `"${item}"`).join(', ')
        str += 'intersects(authors,['+authList+'])' // authors
      }
      if (str.endsWith(' && ')) {
        str = str.slice(0, -4);
      }
      //console.log(str)
      
      const response = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
        {spec: {projection: 'id', filter: str}},
        {
            params: {
                'action': 'evaluate'
            },
            headers: {
                'authorization': 'Bearer '+ window.localStorage.getItem('token'),
                'accept': 'application/json', //xml
                'content-type': 'application/json'
            }
        }
      );  
      if(response.data.count===0)
      {
        toolDispatch({type: 'SET_QUERY_RESULT', payload: []})
        toolDispatch({type: 'SAVE_FILTERS'})
      }
      else{
      const idList = response.data.tuples.map((obj) => obj.cells[0].str).map(item => `"${item}"`).join(', ');
      const response1 = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
        {spec: {include: 'this,authors.this,recipe.this,environmentConditions.this,substrate.this,furnace.this,properties.this',filter:'intersects(id,['+idList+'])'} },
        {
            params: {
                'action': 'fetch'
            },
            headers: {
                'authorization': 'Bearer '+ window.localStorage.getItem('token'),
                'accept': 'application/json', //xml
                'content-type': 'application/json'
            }
        }
      );  
        const data=response1.data.objs
        //console.log(data)
        toolDispatch({type: 'SET_QUERY_RESULT', payload: data})
        toolDispatch({type: 'SAVE_FILTERS'})
      }
      
    } catch (e) {
      flashError('Oops. Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingPage/>
  }
  if (error) {
    return <Redirect to='/tool'/>
  }
  // if (!userState.signedIn) {
  //   return <Redirect to='/'/>
  // }
  // else{
  return (<>
    <Sidebar
      texts={['Query', 'Result', 'Submission']}
      refs={[queryRef, resultRef, submitRef]}
    />
    <div className='w-full md:flex flex-col md:container md:mx-auto mt-5 border rounded p-5'
         ref={queryRef}>
      <h2 className='text-center text-4xl font-bold mr-2 md:mb-4'>Query</h2>
      <hr/>
      <div className='w-full md:flex flex-row mt-5 '>
        <div className='md:w-1/2 px-10'>
          <h2 className='text-center text-4xl font-bold mr-2 md:mb-4'>Search By</h2>
          <div className='h-screen-3/4 overflow-y-scroll border p-3'>
            <section className='w-full flex flex-col mb-5'>
              <div className='flex justify-center align-middle mb-4'>
                <h2 className='text-center text-3xl font-bold mr-2'>Environment Conditions</h2>
                <div className='flex flex-col justify-center'>
                  <img className='w-6 h-6 mr-2' src="https://img.icons8.com/material-two-tone/24/000000/help.png"
                       alt='?'
                       onMouseOver={() => setMouseOverEnvironmentConditions(true)}
                       onMouseLeave={() => setMouseOverEnvironmentConditions(false)}/>
                </div>
                <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='environment-conditions-btn'
                  onClick={() => setShowEnvironmentConditions(!showEnvironmentConditions)}
                >
                  +
                </button>
              </div>
              {mouseOverEnvironmentConditions &&
                <div className='mx-auto my-2 p-2 bg-gray-200'>
                  Ambient Temperature and Dew Point
                </div>
              }
              {showEnvironmentConditions || <hr/>}
              {showEnvironmentConditions && <SearchByEnvironmentCondition/>}
            </section>
            <section className='w-full flex flex-col mb-5'>
              <div className='flex justify-center align-middle mb-4'>
                <h2 className='text-center text-3xl font-bold mr-2'>Furnace</h2>
                <div className='flex flex-col justify-center'>
                  <img className='w-6 h-6 mr-2' src="https://img.icons8.com/material-two-tone/24/000000/help.png"
                       alt='?'
                       onMouseOver={() => setMouseOverFurnaces(true)}
                       onMouseLeave={() => setMouseOverFurnaces(false)}/>
                </div>
                <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='furnace-btn' onClick={() => setShowFurnaces(!showFurnaces)}
                >
                  +
                </button>
              </div>
              {mouseOverFurnaces && <div className='mx-auto my-2 p-2 bg-gray-200'>
                Static parameters of the furnace such as tube diameter
              </div>}
              {showFurnaces || <hr/>}
              {showFurnaces && <SearchByFurnace/>}
            </section>
            <section className='w-full flex flex-col mb-5'>
              <div className='flex justify-center align-middle mb-4'>
                <h2 className='text-center text-3xl font-bold mr-2'>Substrate</h2>
                <div className='flex flex-col justify-center'>
                  <img className='w-6 h-6 mr-2' src="https://img.icons8.com/material-two-tone/24/000000/help.png"
                       alt='?'
                       onMouseOver={() => setMouseOverSubstrates(true)}
                       onMouseLeave={() => setMouseOverSubstrates(false)}/>
                </div>
                <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='substrate-btn' onClick={() => setShowSubstrates(!showSubstrates)}
                >
                  +
                </button>
              </div>
              {mouseOverSubstrates && <div className='mx-auto my-2 p-2 bg-gray-200'>
                Static parameters of the substrate such as catalyst and diameter
              </div>}
              {showSubstrates || <hr/>}
              {showSubstrates && <SearchBySubstrate/>}
            </section>
            <section className='w-full flex flex-col mb-5'>
              <div className='flex justify-center align-middle mb-4'>
                <h2 className='text-center text-3xl font-bold mr-2'>Recipe</h2>
                <div className='flex flex-col justify-center'>
                  <img className='w-6 h-6 mr-2' src="https://img.icons8.com/material-two-tone/24/000000/help.png"
                       alt='?'
                       onMouseOver={() => setMouseOverRecipes(true)}
                       onMouseLeave={() => setMouseOverRecipes(false)}
                  />
                </div>
                <hr/>
                <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='recipe-btn'
                  onClick={() => setShowRecipes(!showRecipes) /*showAlert('temporarily disabled (under maintenance)'*/}
                >
                  +
                </button>
              </div>
              {mouseOverRecipes && <div className='mx-auto my-2 p-2 bg-gray-200'>
                Parameters describing the annealing, growing and cooling steps
              </div>}
              {showRecipes || <hr/>}
              {showRecipes && <SearchByRecipe/>}
              {/* {showRecipes && <Recipes
                recipes={toolState.recipes}
              />} */}
            </section>
            <section className='w-full flex flex-col mb-5'>
              <div className='flex justify-center align-middle mb-4'>
                <h2 className='text-center text-3xl font-bold mr-2'>Characterization</h2>
                <div className='flex flex-col justify-center'>
                  <img className='w-6 h-6 mr-2' src="https://img.icons8.com/material-two-tone/24/000000/help.png"
                       alt='?'
                       onMouseOver={() => setMouseOverProperties(true)}
                       onMouseLeave={() => setMouseOverProperties(false)}/>
                </div>
                <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='property-btn' onClick={() => setShowProperties(!showProperties)}
                >
                  +
                </button>
              </div>
              {mouseOverProperties && <div className='mx-auto my-2 p-2 bg-gray-200'>
                Properties output from characterization techniques
              </div>}
              {showProperties || <hr/>}
              {showProperties && <SearchByCharacterization/>}
            </section>
            <section className='w-full flex flex-col mb-5'>
              <div className='flex justify-center align-middle mb-4'>
                <h2 className='text-center text-3xl font-bold mr-2'>Authors</h2>
                <div className='flex flex-col justify-center'>
                  <img className='w-6 h-6 mr-2' src="https://img.icons8.com/material-two-tone/24/000000/help.png"
                       alt='?'
                       onMouseOver={() => setMouseOverAuthors(true)}
                       onMouseLeave={() => setMouseOverAuthors(false)}/>
                </div>
                <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='author-btn' onClick={() => setShowAuthors(!showAuthors)}
                >
                  +
                </button>
              </div>
              {mouseOverAuthors &&
                <div className='mx-auto my-2 p-2 bg-gray-200'>
                  Authors names and affiliations
                </div>
              }
              {showAuthors || <hr/>}
              {showAuthors && <SearchByAuthor/>}
            </section>
          </div>
        </div>

        <div className='md:w-1/2 px-10'>
          <div className='md:w-full flex flex-col'>
            <h2 className='text-center text-4xl font-bold mr-2 md:mb-4'>Current Search Filters</h2>
            <div className='h-screen-3/4 overflow-y-scroll border p-3'>
              <SearchFilters filters={toolState.filters}/>
            </div>
            <div className='md:w-full md:flex md:flex-row md:justify-evenly'>
              <button
                className='self-center w-1/3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5'
                type='button' onClick={() => {
                fetchExperiments()
              }}
              >
                Search Experiments
              </button>
              {toolState.queryResults.length > 0 && <button
                className='self-center w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5'
                type='button' onClick={() => {
                resultRef.current.scrollIntoView({behavior: "smooth"})
              }}
              >
                Go to Results
              </button>}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref={resultRef} className='w-full md:flex flex-col md:container md:mx-auto mt-10 border rounded p-5'>
      <h2 className='text-center text-4xl font-bold mb-4'>Query Result</h2>
      <hr className='mb-5'/>
      {toolState.queryResults.length === 0 &&
        <h4 className='text-center text-3xl font-bold'>No experiment was found.</h4>}
      {<QueryResultTable/>}
    </div>
    <div className='w-full md:flex flex-col md:container md:mx-auto mt-10 border rounded p-5'
         ref={submitRef}>
        {isInitialized &&<ToolSubmit/>}
    </div>
  </>)
}
//}
export default Tool
