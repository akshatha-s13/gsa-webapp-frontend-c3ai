import React, {useEffect, useReducer, useRef, useState} from "react";
import experimentReducer, {experimentDefaultState} from "../reducers/experimentReducer";
import axios from "axios";
import {Redirect} from "react-router-dom";

import ExperimentDetails from "../containers/ExperimentDetails";
import Raman from "../components/Raman";
import Sem from "../components/Sem";
import Sidebar from "../components/Sidebar";
import RecipeGraph from "../components/RecipeGraph";
import { showAlert } from '../components/CustomAlert';

export const ExperimentContext = React.createContext();

const ExperimentView = () => {
  const [experimentId, setExperimentId] = useState(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [experimentState, experimentDispatch] = useReducer(experimentReducer, experimentDefaultState)

  const detailRef = useRef(null)
  const recipeRef = useRef(null)
  const ramanRef = useRef(null)
  const semRef = useRef(null)

  const getExperiment = async(experimentId) => {
    //const url = host + '/experiments/' + experimentId
    try {
      const response = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
        {spec: {include: 'this,authors.this,recipe.this,recipe.preparationSteps.this,environmentConditions.this,substrate.this,substrate.this,furnace.this,properties.this,ramanFiles.this,semFiles.this',filter:"id=='"+experimentId+"'"} },
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
      const data=response.data.objs
      //console.log(data)
      //const response = await axios.get(url)
      //const data = response.data
      experimentDispatch({type: 'SET_EXPERIMENT', payload: data})
      setIsLoading(false)
    } catch (e) {
      //console.log(e)
     showAlert(e.message)
    }
  }

  useEffect(() => {
    const expId = window.location.pathname.slice(1).split('/')[2]
    if (expId) {
      setExperimentId(expId)
    }
    else{
      setIsError(true)
    }
  }, [])

  useEffect(() => {
    if (experimentId) {
      getExperiment(experimentId)
    }
  }, [experimentId])

  if (isError) {
    return <Redirect to='/tool'/>
  }
  if (isLoading) {
    return <></>
  }
  return (
    <ExperimentContext.Provider value={{...experimentState, experimentDispatch}}>
      <Sidebar
        texts={['Detail', 'Recipe', 'Raman', 'SEM']}
        refs={[detailRef, recipeRef, ramanRef, semRef]}
      />
      <div className='w-full container mx-auto my-5'>
        <h2 className='text-center text-4xl font-bold mb-5'>Experiment {experimentState.experiment.id}</h2>
        <div ref={detailRef} className='border rounded p-5'>
          <h2 className='text-center text-3xl font-bold mb-5'>Details</h2>
          <hr/>
          <ExperimentDetails/>
        </div>
        <div ref={recipeRef} className='border rounded p-5 mt-5'>
          <h2 className='text-center text-4xl font-bold mb-5'>Recipe</h2>
          <hr/>
          <RecipeGraph/>
        </div>
        <div ref={ramanRef} className='border rounded p-5 mt-5'>
          <h2 className='text-center text-4xl font-bold mb-5'>Raman</h2>
          <hr/>
          <Raman/>
        </div>
        <div id="jpegImage" ref={semRef} className='border rounded p-5 mt-5'>
          <h2 className='text-center text-4xl font-bold mb-4'>SEM</h2>
          <hr/>
          <Sem/>
          {/* <div style={{ width: '80%', height: '80%' }}><Sem/></div> */}
        </div>
        </div>
    </ExperimentContext.Provider>
  )
}

export default ExperimentView;