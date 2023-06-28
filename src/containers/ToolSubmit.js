import React, {useContext, useEffect, useReducer, useState} from "react";
import {GlobalContext} from "../pages/App";
import {
  defaultPrecision,
  materialNameOptions,
  prepNameOptions
} from "../settings";
import submissionReducer, {submissionDefaultState} from "../reducers/submissionReducer";
import axios from "axios";
import { showAlert } from '../components/CustomAlert';

const ToolSubmit = () => {
  const {userState, toolState} = useContext(GlobalContext)
  const [submissionState, submissionDispatch] = useReducer(submissionReducer, submissionDefaultState)
  const [authorIdToAdd, setAuthorIdToAdd] = useState("")
  const [ownerGroups,setOwnerGroups] = useState([]) 

  useEffect(() => {
    const init = async () => {
      const response = await axios.post(
      process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Author', 
      {spec: {include: 'grdbGroups',filter:"user=='"+userState.userId+"'"}}, 
      {
          params: {
              'action': 'fetch'
          },
          headers: {
              'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
              'accept': 'application/json', //xml
              'content-type': 'application/json'
          }
      } 
    );
    //console.log(response.data)
    if(response.status===200){
      if(response.data.count>0){
        if (response.data.objs[0].grdbGroups){
          setOwnerGroups([...new Set(response.data.objs[0].grdbGroups.map(group => group.id))])
        }
        else{
          submissionDispatch({
            type: 'INIT_SUBMISSION_DEFAULT',
            payload: {
              environmentConditionsNumber: "",
              furnaceNumber: "",
              recipeNumber: "",
              propertiesNumber: "",
              substrateNumber: "",
              ownerNumber: "",
              catalyst: toolState.catalysts[0],
              carbonSource: toolState.carbonSource[0]
            }
          });
        }
      }
    }
    for (const author of toolState.authors) {
      if (author.id === userState.authorId) {
        submissionDispatch({type: 'INIT_SUBMISSION', payload: author})
        return
      }
    }
  }
  init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // useEffect(()=>{
  //   submissionDispatch({
  //     type: 'INIT_SUBMISSION_DEFAULT',
  //     payload: {
  //       environmentConditionsNumber: toolState.environmentConditions[0],
  //       furnaceNumber: toolState.furnaces[0],
  //       recipeNumber: toolState.recipes[0].id,
  //       propertiesNumber: toolState.properties[0].id,
  //       substrateNumber: toolState.substrates[0].id,
  //       ownerNumber: ownerGroups[0],
  //       catalyst: toolState.catalysts[0],
  //       carbonSource: toolState.carbonSource[0]
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[ownerGroups])

  const addAuthor = () => {
    for (const author of submissionState.authors) {
      if (author.id === authorIdToAdd) {
        return
      }
    }
    for (const author of toolState.authors) {
      if (author.id === authorIdToAdd) {
        const payload = author
        submissionDispatch({type: 'ADD_AUTHOR', payload})
      }
    }
  }
  const addPrepStep = () => {
    submissionDispatch({type: 'ADD_PREPARATION_STEP'})
  }
  const onSubmitExperiment = async() => {
    if (!userState.signedIn) {
     showAlert("Please log in before making a new submission.")
      return
    }

    if(submissionState.ownerNumber==="")
    {
      showAlert("Please select owner.")
      return 
    }
    if(submissionState.visibility==="")
    {
      showAlert("Please select visibility.")
      return 
    }

    let formData = new FormData()
    for (const file of submissionState.semFiles) {
      formData.append(`sem_${file.name}`, file)
    }
    for (const file of submissionState.ramanFiles) {
      formData.append(`raman_${file.name}`, file)
    }
    
    

    let experimentData = {...submissionState}
    delete experimentData.semFiles
    delete experimentData.ramanFiles

    // const stringifiedExperimentData = JSON.stringify(experimentData)
    // formData.append('experimentData', stringifiedExperimentData)
    // axios.post(host + '/experiments/submit', formData).then(function (response) {
    //  showAlert(response.data);
    // })
    // .catch(function (error) {
    //  showAlert(error);
    // });

    // me
    let data = experimentData
    let db = {}
    // if (data.useCustomEnvironmentConditions) {
    //   const ambient_temperature = data.ambientTemperature //? data.ambientTemperature : null;
    //   const dew_point = data.dewPoint //? data.dewPoint : null;
    //   db.environmentConditions = {'ambientTemperature':ambient_temperature,'dewPoint':dew_point}
    // } else {
      db.environmentConditions = {'id': data.environmentConditionsNumber}
    //}
    
    // if (data.useCustomFurnace) {
    //   const tube_diameter = data.tubeDiameter //? data.tubeDiameter : null;
    //   const cross_sectional_area = data.crossSectionalArea //? data.crossSectionalArea : null;
    //   const tube_length = data.tubeLength //? data.tubeLength : null;
    //   const length_of_heated_region = data.lengthOfHeatedRegion //? data.lengthOfHeatedRegion : null;
    //   db.furnace = {'tubeDiameter': tube_diameter, 'crossSectionalArea': cross_sectional_area, 'tubeLength': tube_length, 'lengthOfHeatedRegion': length_of_heated_region};
    // } else {
      db.furnace = {'id': data.furnaceNumber}
    //}
    
    // if (data.useCustomSubstrate) {
    //   const catalyst = data.catalyst //? data.catalyst : null;
    //   const thickness = data.thickness //? data.thickness : null;
    //   const diameter = data.diameter //? data.diameter : null;
    //   const length = data.length //? data.length : null;
    //   const surface_area = data.surfaceArea //? data.surfaceArea : null;
    //   db.substrate = {'catalyst':catalyst, 'thickness':thickness, 'diameter': diameter, 'length':length, 'surfaceArea':surface_area};
    // } else {
      db.substrate = {'id':data.substrateNumber};
    //}
    
    // if (data.useCustomProperties){
    //   const average_thickness_of_growth = data.avgThicknessOfGrowth //|| null;
    //   const standard_deviation_of_growth = data.stdDevOfGrowth //|| null;
    //   const number_of_layers = data.numberOfLayers //|| null;
    //   const growth_coverage = data.growthCoverage //|| null;
    //   const domain_size = data.domainSize //|| null;
    //   db.properties = [{
    //     'averageThicknessOfGrowth': average_thickness_of_growth,
    //     'standardDeviationOfGrowth': standard_deviation_of_growth,
    //     'numberOfLayers': number_of_layers,
    //     'growthCoverage': growth_coverage,
    //     'domainSize': domain_size,
    //   }] 
    // } else{
      db.properties = [{'id':data.propertiesNumber}];
    //}
           
    // if (data.useCustomRecipe) {
    //   const carbon_source = data.carbonSource //? data.carbonSource : null;
    //   const base_pressure = data.basePressure //? data.basePressure : null;
    //   db.recipe = {'carbonSource':carbon_source, 'basePressure':base_pressure};
    // } else {
      db.recipe = {'id':data.recipeNumber};
    //}
    
    // for (let i = 0; i < data.preparationSteps.length; i++) {
    //   const prep_step = data.preparationSteps[i];
    //   db.preparationStep = {
    //   'name' : prep_step.name ,//||null,
    //   'duration' : prep_step.duration ,//||null,
    //   'furnaceTemperature' : prep_step.furnaceTemperature ,//||null,
    //   'furnacePressure' : prep_step.furnacePressure ,//||null,
    //   'sampleLocation' : prep_step.sampleLocation ,//||null,
    //   'heliumFlowRate' : prep_step.heliumFlowRate ,//||null,
    //   'hydrogenFlowRate' : prep_step.hydrogenFlowRate ,//||null,
    //   'carbonSourceFlowRate' : prep_step.carbonSourceFlowRate ,//||null,
    //   'argonFlowRate' : prep_step.argonFlowRate ,//||null,
    //   'coolingRate' : prep_step.coolingRate ,//||null,
    //   }
    // }

    if (data.materialName) {
      db.materialName = data.materialName;
    }

    // expt date add later
    db.owner = data.ownerNumber;
    db.visibility = data.visibility;
    db.submittedBy = {'id': userState.authorId}
    db.authors = []
    for (const author of data.authors) {
        db.authors.push({'id':author.id})
    }
    console.log(db)
    try{
    // adding owner,visibility,(todo - submitted by) for custom Substrate (EnvironmentConditions,Properties - todo)
    if(data.useCustomSubstrate){
      const response0 = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Substrate', 
        {this:{id:db.substrate.id,owner:db.owner,visibility:db.visibility}},
        {
            params: {
              'action':'merge'
            },
            headers: {
                'authorization': 'Bearer '+window.localStorage.getItem('token'),
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        }
      );
      if(response0.status!==200){
        console.log("Error saving custom substrate")
      }
    }
    const response = await axios.post(
      process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Experiment', 
      {'this':db},
      {
          params: {
            'action':'create'
          },
          headers: {
              'authorization': 'Bearer '+window.localStorage.getItem('token'),
              'accept': 'application/json',
              'content-type': 'application/json'
          }
      }
    );
   showAlert("Experiment Submitted with ID "+response.data.id)
    if(response.status===200)
    {
      const expId = response.data.id;

      // upload raman file
      async function uploadFile(file) {
        const contentType = file.type;
        const contentEncoding = "utf-8";
        const fileContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });

        const base64Content = fileContent.split(",")[1];
        const content = base64Content;

        const response1 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/File',
          {
            urlOrEncodedPath: "RamanFile/"+submissionState.ownerNumber+"/"+expId+"/"+file.name,
            content,
            contentType,
            contentEncoding,
          },
          {
            params: { action: "createFile" },
            headers: {
              authorization: "Bearer "+window.localStorage.getItem("token"),
              accept: "application/json",
              "content-type": "application/json",
            },
          }
        );

        //console.log(response1);

        if (response1.status === 200) {
          const response2 = await axios.post(
            `${process.env.REACT_APP_C3_URL}/api/1/${process.env.REACT_APP_C3_TENANT}/${process.env.REACT_APP_C3_TAG}/RamanFile`,
            {
              this: {
                experiment: { id: expId },
                wavelength: 532,
                filename: file.name,
                file: response1.data,
              },
            },
            {
              params: { action: "create" },
              headers: {
                authorization: `Bearer ${window.localStorage.getItem("token")}`,
                accept: "application/json",
                "content-type": "application/json",
              },
            }
          );
          
          //console.log(response2);
          if (response2.status !== 200)
          {
              showAlert("Error creating Raman File")
          }
        }
      }

      const uploadPromises = Array.from(submissionState.ramanFiles).map(uploadFile);
      await Promise.all(uploadPromises);

      // upload sem files

      async function uploadSemFile(file) {
        const contentType = file.type;
        const contentEncoding = "utf-8";
        const fileContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });

        const base64Content = fileContent.split(",")[1];
        const content = base64Content;

        const response1 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/File',
          {
            urlOrEncodedPath: "SemFile/"+submissionState.ownerNumber+"/"+expId+"/"+file.name,
            content,
            contentType,
            contentEncoding,
          },
          {
            params: { action: "createFile" },
            headers: {
              authorization: "Bearer "+window.localStorage.getItem("token"),
              accept: "application/json",
              "content-type": "application/json",
            },
          }
        );

        //console.log(response1);

        if (response1.status === 200) {
          const response2 = await axios.post(
            `${process.env.REACT_APP_C3_URL}/api/1/${process.env.REACT_APP_C3_TENANT}/${process.env.REACT_APP_C3_TAG}/SemFile`,
            {
              this: {
                experiment: { id: expId },
                filename: file.name,
                file: response1.data,
              },
            },
            {
              params: { action: "create" },
              headers: {
                authorization: `Bearer ${window.localStorage.getItem("token")}`,
                accept: "application/json",
                "content-type": "application/json",
              },
            }
          );
          
          //console.log(response2);
          if (response2.status !== 200)
          {
              showAlert("Error creating Sem File")
          }
        }
      }

      const uploadPromisesSem = Array.from(submissionState.semFiles).map(uploadSemFile);
      await Promise.all(uploadPromisesSem);

      // add relation to authors db.authors
      for (const author of data.authors) {
        const authorId = author.id;
        const response1 = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/ExperimentAuthor', 
          {"this":{"id":expId+"_"+authorId,"experiment":{"id":expId},"author":{"id":authorId}}},
          {
              params: {
                'action':'create'
              },
              headers: {
                  'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                  'accept': 'application/json',
                  'content-type': 'application/json'
              }
          }
        );
        if(response1.status!==200)
        {
          showAlert("Error linking author and experiment")
        }
      }  
    }
    }
    catch(e){
      //console.log(e.message)
     showAlert(e.message)
    }
  }

  const saveEnvironmentConditions = async () => {
    const { ambientTemperature, dewPoint } = submissionState;
    try {
      const response = await axios.post(
        process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/EnvironmentConditions',
        {
          this: {
            ambientTemperature: ambientTemperature,
            dewPoint: dewPoint
          }
        },
        {
          params: {
            'action':'create'
          },
          headers: {
            authorization: 'Bearer ' + window.localStorage.getItem('token'),
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
      submissionDispatch({ type: 'ENVIRONMENT_CONDITIONS_NUMBER_CHANGE', payload: response.data.id });
      // submissionDispatch({
      //   type: 'SET_CUSTOM_ENVIRONMENT_CONDITIONS',
      //   payload: false
      // })
      showAlert('Environment Conditions Saved with ID ' + response.data.id);
    } catch (error) {
      console.log(error);
      showAlert('Error saving Environment Conditions');
    }
  };

  const saveFurnace = async () => {
    const { tubeDiameter, crossSectionalArea, tubeLength, lengthOfHeatedRegion } = submissionState;
    try {
      const response = await axios.post(
        process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/Furnace',
        {
          this: {
            tubeDiameter: tubeDiameter,
            crossSectionalArea: crossSectionalArea,
            tubeLength: tubeLength,
            lengthOfHeatedRegion: lengthOfHeatedRegion,
            submittedBy: {id:userState.authorId}
          }
        },
        {
          params: {
            'action':'create'
          },
          headers: {
            authorization: 'Bearer ' + window.localStorage.getItem('token'),
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
      submissionDispatch({ type: 'FURNACE_NUMBER_CHANGE', payload: response.data.id });
      showAlert('Furnace Saved with ID ' + response.data.id);
    } catch (error) {
      console.log(error);
      showAlert('Error saving Furnace');
    }
  };
  
  const saveSubstrate = async () => {
    const { catalyst, thickness, diameter, length, surfaceArea } = submissionState;
    try {
      const response = await axios.post(
        process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/Substrate',
        {
          this: {
            catalyst: catalyst,
            thickness: thickness,
            diameter: diameter,
            length: length,
            surfaceArea: surfaceArea,
            submittedBy: {id:userState.authorId}
          }
        },
        {
          params: {
            'action':'create'
          },
          headers: {
            authorization: 'Bearer ' + window.localStorage.getItem('token'),
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
      submissionDispatch({ type: 'SUBSTRATE_NUMBER_CHANGE', payload: response.data.id });
      showAlert('Substrate Saved with ID ' + response.data.id);
    } catch (error) {
      console.log(error);
      showAlert('Error saving Substrate');
    }
  };
  
  const saveProperties = async () => {
    const {
      avgThicknessOfGrowth,
      stdDevOfGrowth,
      numberOfLayers,
      growthCoverage,
      domainSize
    } = submissionState;
  
    try {
      const response = await axios.post(
        process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/Properties',
        {
          this: {
            averageThicknessOfGrowth: avgThicknessOfGrowth,
            standardDeviationOfGrowth: stdDevOfGrowth,
            numberOfLayers: numberOfLayers,
            growthCoverage: growthCoverage,
            domainSize: domainSize
          }
        },
        {
          params: {
            'action': 'create'
          },
          headers: {
            authorization: 'Bearer ' + window.localStorage.getItem('token'),
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
  
      submissionDispatch({ type: 'PROPERTIES_NUMBER_CHANGE', payload: response.data.id });
      showAlert('Properties Saved with ID ' + response.data.id);
    } catch (error) {
      console.log(error);
      showAlert('Error saving Properties');
    }
  };

  const saveRecipe = async () => {
    const { carbonSource, basePressure, preparationSteps } = submissionState;

    try {
      const response = await axios.post(
        process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/Recipe',
        {
          this: {
            carbonSource: carbonSource,
            basePressure: basePressure,
            submittedBy: {id:userState.authorId}
          }
        },
        {
          params: {
            'action':'create'
          },
          headers: {
            authorization: 'Bearer ' + window.localStorage.getItem('token'),
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
      submissionDispatch({ type: 'RECIPE_NUMBER_CHANGE', payload: response.data.id });
      showAlert('Recipe Saved with ID ' + response.data.id);

      for (let i = 0; i < preparationSteps.length; i++) {
        const prep_step = preparationSteps[i];
        let preparationStep = {
        'recipe' : {'id': response.data.id},
        'name' : prep_step.name ,//||null,
        'duration' : prep_step.duration ,//||null,
        'furnaceTemperature' : prep_step.furnaceTemperature ,//||null,
        'furnacePressure' : prep_step.furnacePressure ,//||null,
        'sampleLocation' : prep_step.sampleLocation ,//||null,
        'heliumFlowRate' : prep_step.heliumFlowRate ,//||null,
        'hydrogenFlowRate' : prep_step.hydrogenFlowRate ,//||null,
        'carbonSourceFlowRate' : prep_step.carbonSourceFlowRate ,//||null,
        'argonFlowRate' : prep_step.argonFlowRate ,//||null,
        'coolingRate' : prep_step.coolingRate ,//||null,
        }
        try {
          await axios.post(
            process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/PreparationStep',
            {
              this: preparationStep
            },
            {
              params: {
                'action':'create'
              },
              headers: {
                authorization: 'Bearer ' + window.localStorage.getItem('token'),
                'accept': 'application/json',
                'content-type': 'application/json'
              }
            }
          );
          //submissionDispatch({ type: 'RECIPE_NUMBER_CHANGE', payload: response.data.id });
          //showAlert('Preparation Step Saved');
        } catch (error) {
          console.log(error);
          showAlert('Error saving Preparation Step');
        }
      }
  
    } catch (error) {
      console.log(error);
      showAlert('Error saving Recipe');
    }
  };
  

  const environmentConditionsForm =
    submissionState.useCustomEnvironmentConditions
      ?
      <div className='md:w-3/4 flex flex-col md:items-center'>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-ambient-temperature">
              Ambient Temperature
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-ambient-temperature" type="number" step={defaultPrecision}
              value={submissionState.ambientTemperature}
              onChange={e => submissionDispatch({
                type: 'AMBIENT_TEMPERATURE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>&deg;C</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-dew-point">
              Dew Point
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-dew-point" type="number" step={defaultPrecision} value={submissionState.dewPoint}
              onChange={e => submissionDispatch({
                type: 'DEW_POINT_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>&deg;C</span>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={saveEnvironmentConditions}
        >
          Save
        </button>

      </div>
      :
      <>
        <div>
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="env-con-submit">
            Environment Conditions Number
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="env-con-submit"
            onChange={e => submissionDispatch({
              type: 'ENVIRONMENT_CONDITIONS_NUMBER_CHANGE', payload: e.target.value
            })}
            value={submissionState.environmentConditionsNumber}
            required
          >
            <option disabled value="">    Select    </option>
            {toolState.environmentConditions.map((envCon) => {
              return <option key={envCon}>{envCon}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </>

  const furnaceForm =
    submissionState.useCustomFurnace
      ?
      <div className='md:w-3/4 flex flex-col md:items-center'>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-tube-diameter">
              Tube Diameter
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-tube-diameter" type="number" step={defaultPrecision}
              value={submissionState.tubeDiameter}
              onChange={e => submissionDispatch({
                type: 'TUBE_DIAMETER_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-cross-sectional-area">
              Cross Sectional Area
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-cross-sectional-area" type="number" step={defaultPrecision}
              value={submissionState.crossSectionalArea}
              onChange={e => submissionDispatch({
                type: 'CROSS_SECTIONAL_AREA_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm&sup2;</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-tube-length">
              Tube Length
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-tube-length" type="number" step={defaultPrecision}
              value={submissionState.tubeLength}
              onChange={e => submissionDispatch({
                type: 'TUBE_LENGTH_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-lohr">
              Length of Heated Region
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-lohr" type="number" step={defaultPrecision}
              value={submissionState.lengthOfHeatedRegion}
              onChange={e => submissionDispatch({
                type: 'LENGTH_OF_HEATED_REGION_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm</span>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={saveFurnace}
        >
          Save
        </button>

      </div>
      :
      <>
        <div>
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="furnace-submit">
            Furnace Number
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="furnace-submit"
            onChange={e => submissionDispatch({
              type: 'FURNACE_NUMBER_CHANGE',
              payload: e.target.value
            })}
            value={submissionState.furnaceNumber}
            required
          >
            <option disabled value="">    Select    </option>
            {toolState.furnaces.map((furnace) => {
              return <option key={furnace}>{furnace}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </>

  const substrateForm =
    submissionState.useCustomSubstrate
      ?
      <div className='md:w-3/4 md:items-center flex flex-col'>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-catalyst">
              Catalyst
            </label>
          </div>
          <div className="md:w-1/3">
            <select
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-catalyst"
              value={submissionState.catalyst}
              onChange={e => {submissionDispatch({type: 'CATALYST_CHANGE', payload: e.target.value});}} 
              // if(e.target.value==="Other") document.getElementById("form-catalyst-box").disabled=false;
            >
              {toolState.catalysts.map((catalyst) => {
                return <option key={catalyst}>{catalyst}</option>
              })}
              {/* <option key="Other">Other</option> */} 
            </select>
          </div>
        </div>

        {/* <div className="md:w-2/3">
              <input
              disabled="disabled"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-catalyst-box" type="text"  placeholder="Enter Other Catalyst" //value={submissionState.catalyst}
              onChange={e => submissionDispatch({
                type: 'CATALYST_CHANGE',
                payload: e.target.value
              })}
              />
        </div> 
        <br></br> */}

        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-thickness">
              Thickness
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-thickness" type="number" step={defaultPrecision} value={submissionState.thickness}
              onChange={e => submissionDispatch({
                type: 'THICKNESS_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-diameter">
              Diameter
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-diameter" type="number" step={defaultPrecision} value={submissionState.diameter}
              onChange={e => submissionDispatch({
                type: 'DIAMETER_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span
            className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-length">
              Length
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-length" type="number" step={defaultPrecision} value={submissionState.length}
              onChange={e => submissionDispatch({
                type: 'LENGTH_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-surface-area">
              Surface Area
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-surface-area" type="number" step={defaultPrecision}
              value={submissionState.surfaceArea}
              onChange={e => submissionDispatch({
                type: 'SURFACE_AREA_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>mm&sup2;</span>
        </div>
        
        {/* (Custom Name for substrate) 
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="form-substrate-id">
              Substrate Number
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-substrate-id"
              type="text"
              placeholder="Enter Substrate Number"
              //value={submissionState.substrateNumber}
              onChange={e =>
                submissionDispatch({
                  type: 'SUBSTRATE_NUMBER_CHANGE',
                  payload: e.target.value
                })
              }
            />
          </div>
        </div> */}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={saveSubstrate}
        >
          Save
        </button>
      </div>
      :
      <>
        <div>
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="substrate-submit">
            Substrate Number
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="substrate-submit"
            onChange={e => submissionDispatch({
              type: 'SUBSTRATE_NUMBER_CHANGE',
              payload: e.target.value
            })}
            value={submissionState.substrateNumber}
            required
          >
            <option disabled value="">    Select    </option>
            {toolState.substrates.map((substrate) => {
              return <option key={substrate} >{substrate}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </>

  const prepStepForm =
    <div className='flex flex-col w-full'>
      <h5 className='text-center text-xl font-bold mb-4'>Preparation Steps</h5>
      {submissionState.preparationSteps.map((preparationStep, i) => {
        return (
          <div key={i} className='py-2 px-4 mb-2 border rounded'>
            <div className='flex justify-between'>
              <h6 className='font-bold ml-3'>Preparation Step #{i + 1}</h6>
              <button
                className='w-9 h-9 text-center bg-red-500 hover:bg-red-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                type='button'
                onClick={() => {
                  submissionDispatch({type: 'DEL_PREPARATION_STEP', payload: i})
                }}
              >
                X
              </button>
            </div>
            <hr className='my-1'/>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Name :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.name}
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Duration :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.duration} min
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Furnace Temperature :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.furnaceTemperature} &deg;C
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Furnace Pressure :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.furnacePressure} Torr
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Sample Location :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.sampleLocation} mm
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Sample Location :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.sampleLocation} mm
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Helium Flow Rate :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.heliumFlowRate} sccm
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Hydrogen Flow Rate :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.hydrogenFlowRate} sccm
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Carbon Source Flow Rate :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.carbonSourceFlowRate} sccm
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Argon Flow Rate :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.argonFlowRate} sccm
              </span>
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-2 pr-4'>
                Cooling Rate :
              </span>
              <span className='md:w-1/2'>
                {preparationStep.coolingRate} &deg;C / min
              </span>
            </div>
          </div>
        )
      })}
      <div className='md:w-3/4 md:flex md:flex-col items-center justify-center mx-auto'>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className='md:w-1/2'>
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-name">
              Name
            </label>
          </div>
          <div className="md:w-1/3 relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="form-name"
              onChange={e => submissionDispatch({type: 'NAME_CHANGE', payload: e.target.value})}
              value={submissionState.name}
            >
              {prepNameOptions.map((prepName) => {
                return <option key={prepName}>{prepName}</option>
              })}
            </select>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-duration">
              Duration
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-duration" type="number" step={defaultPrecision} value={submissionState.duration}
              onChange={e => submissionDispatch({
                type: 'DURATION_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            min
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-furnace-temperature">
              Furnace Temperature
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-furnace-temperature" type="number" step={defaultPrecision}
              value={submissionState.furnaceTemperature}
              onChange={e => submissionDispatch({
                type: 'FURNACE_TEMPERATURE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            &deg;C
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-furnace-pressure">
              Furnace Pressure
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-furnace-pressure" type="number" step={defaultPrecision}
              value={submissionState.furnacePressure}
              onChange={e => submissionDispatch({
                type: 'FURNACE_PRESSURE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            Torr
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-sample-location">
              Sample Location
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-sample-location" type="number" step={defaultPrecision}
              value={submissionState.sampleLocation}
              onChange={e => submissionDispatch({
                type: 'SAMPLE_LOCATION_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            mm
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-helium-flow-rate">
              Helium Flow Rate
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-helium-flow-rate" type="number" step={defaultPrecision}
              value={submissionState.heliumFlowRate}
              onChange={e => submissionDispatch({
                type: 'HELIUM_FLOW_RATE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            sccm
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-hydrogen-flow-rate">
              Hydrogen Flow Rate
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-hydrogen-flow-rate" type="number" step={defaultPrecision}
              value={submissionState.hydrogenFlowRate}
              onChange={e => submissionDispatch({
                type: 'HYDROGEN_FLOW_RATE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            sccm
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-carbon-source-flow-rate">
              Carbon Source Flow Rate
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-carbon-source-flow-rate" type="number" step={defaultPrecision}
              value={submissionState.carbonSourceFlowRate}
              onChange={e => submissionDispatch({
                type: 'CARBON_SOURCE_FLOW_RATE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            sccm
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-argon-flow-rate">
              Argon Flow Rate
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-argon-flow-rate" type="number" step={defaultPrecision}
              value={submissionState.argonFlowRate}
              onChange={e => submissionDispatch({
                type: 'ARGON_FLOW_RATE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='md:w-1/6 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            sccm
          </span>
        </div>
        <div className="md:w-full md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-cooling-rate">
              Cooling Rate
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-cooling-rate" type="number" step={defaultPrecision}
              value={submissionState.coolingRate}
              onChange={e => submissionDispatch({
                type: 'COOLING_RATE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>
            &deg;C / min
          </span>
        </div>
        <button className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addPrepStep}>
          Add Preparation Step
        </button>
      </div>
    </div>

  const recipeForm =
    submissionState.useCustomRecipe
      ?
      <div className='md:w-3/4 flex flex-col items-center'>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-carbon-source">
              Carbon Source
            </label>
          </div>
          <div className="md:w-1/3">
            <select
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-carbon-source"
              onChange={e => submissionDispatch({type: 'CARBON_SOURCE_CHANGE', payload: e.target.value})}
              value={submissionState.carbonSource}
            >
              {toolState.carbonSource.map((carbonSource) => {
                return <option key={carbonSource}>{carbonSource}</option>
              })}
            </select>
          </div>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-base-pressure">
              Base Pressure
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-base-pressure" type="number" step={defaultPrecision}
              value={submissionState.basePressure}
              onChange={e => submissionDispatch({
                type: 'BASE_PRESSURE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>Torr</span>
        </div>
        <hr className='mb-2'/>
        {prepStepForm}
        
        {/* (Custom Recipe Name)
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="form-recipe-id">
              Recipe Number
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-recipe-id"
              type="text"
              placeholder="Enter Recipe Number"
              //value={submissionState.recipeNumber}
              onChange={e =>
                submissionDispatch({
                  type: 'RECIPE_NUMBER_CHANGE',
                  payload: e.target.value
                })
              }
            />
          </div>
        </div> */}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={saveRecipe}
        >
          Save
        </button>

      </div>
      :
      <>
        <div>
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="recipe-submit">
            Recipe Number
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="recipe-submit"
            onChange={e => submissionDispatch({
              type: 'RECIPE_NUMBER_CHANGE',
              payload: e.target.value
            })}
            value={submissionState.recipeNumber}
            required
          >
            <option disabled value="">    Select    </option>
            {toolState.recipes.map((recipe) => {
              return <option key={recipe} >{recipe}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </>
  const propertiesForm =
    submissionState.useCustomProperties
      ?
      <div className='md:w-3/4 flex flex-col md:items-center'>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-avd-thickness-of-growth">
              Average Thickness of Growth
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-avd-thickness-of-growth" type="number" step={defaultPrecision}
              value={submissionState.avgThicknessOfGrowth}
              onChange={e => submissionDispatch({
                type: 'AVG_THICKNESS_OF_GROWTH_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>nm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-std-dev-of-growth">
              Std. Dev. of Growth
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-std-dev-of-growth" type="number" step={defaultPrecision}
              value={submissionState.stdDevOfGrowth}
              onChange={e => submissionDispatch({
                type: 'STD_DEV_OF_GROWTH_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>nm</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-number-of-layers">
              Number of Layers
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-number-of-layers" type="number" step={1} value={submissionState.numberOfLayers}
              onChange={e => submissionDispatch({
                type: 'NUMBER_OF_LAYERS_CHANGE',
                payload: parseInt(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'/>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-growth-coverage">
              Growth Coverage
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-growth-coverage" type="number" step={0.01} value={submissionState.growthCoverage}
              onChange={e => submissionDispatch({
                type: 'GROWTH_COVERAGE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>%</span>
        </div>
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-domain-size">
              Domain Size
            </label>
          </div>
          <div className="md:w-1/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-domain-size" type="number" step={defaultPrecision}
              value={submissionState.domainSize}
              onChange={e => submissionDispatch({
                type: 'DOMAIN_SIZE_CHANGE',
                payload: parseFloat(e.target.value)
              })}
            />
          </div>
          <span className='block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pl-2'>um&sup2;</span>
        </div>
        {/* <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                   htmlFor="form-shape">
              Shape
            </label>
          </div>
          <div className="md:w-1/3">
            <select
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-shape"
              onChange={e => submissionDispatch({type: 'SHAPE_CHANGE', payload: e.target.value})}
              value={submissionState.shape}
            >
              {shapeOptions.map((shape) => {
                return <option key={shape}>{shape}</option>
              })}
            </select>
          </div>
        </div> */}

        {/* (Custom Properties Name)
        <div className="md:w-3/4 md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="form-properties-id">
              Properties Number
            </label>
          </div>
          <div className="md:w-2/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="form-properties-id"
              type="text"
              placeholder="Enter Properties Number"
              //value={submissionState.propertiesNumber}
              onChange={e =>
                submissionDispatch({
                  type: 'PROPERTIES_NUMBER_CHANGE',
                  payload: e.target.value
                })
              }
            />
          </div>
        </div> */}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={saveProperties}
        >
          Save
        </button>
      </div>
      :
      <>
        <div>
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                 htmlFor="properties-submit">
            Properties Number
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="properties-submit"
            onChange={e => submissionDispatch({
              type: 'PROPERTIES_NUMBER_CHANGE',
              payload: e.target.value
            })}
            value={submissionState.propertiesNumber}
            required
          >
            <option disabled value="">    Select    </option>
            {toolState.properties.map((property) => {
              return <option key={property}>{property}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </>

  const authorsForm =
    <div className='flex flex-col md:w-full'>
      {submissionState.authors.map((author, i) => {
        return (
          <div key={i} className='md:w-3/4 py-2 px-4 mb-2 border rounded mx-auto'>
            <div className='flex justify-between'>
              <h6 className='font-bold ml-3'>Author #{author.id}</h6>
              <button
                className='w-9 h-9 text-center bg-red-500 hover:bg-red-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                type='button'
                onClick={() => {
                  submissionDispatch({type: 'DEL_AUTHOR', payload: i})
                }}
              >
                X
              </button>
            </div>
            <hr className='my-1'/>
            <div className='w-full md:flex md:items-center mb-1'>
              <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Name :</span>
              {author.firstName + " " + author.lastName}
            </div>
            <div className='w-full md:flex md:items-center mb-1'>
              <span
                className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Institution :</span>
              {author.institution}
            </div>
          </div>
        )
      })}
      <div className='flex items-center justify-center'>
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
               htmlFor="author-submit">
          Author Number
        </label>
        <div className='relative mr-4 w-1/3'>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="author-submit"
            value={authorIdToAdd}
            onChange={e => setAuthorIdToAdd(e.target.value)}
          >
            <option disabled value="">    Select    </option>
            {toolState.authors.map((author) => {
              return <option key={author.id}>{author.id}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addAuthor}>
          Add Author
        </button>
      </div>
    </div>


  return (
    <>
      <h2 className='text-center text-4xl font-bold mb-4'>Submit New Experiment Data</h2>
      <hr className='mb-5'/>
      <div className='w-full md:flex flex-row mt-5 '>
      <div className='md:w-1/2 flex flex-col border p-3'>
      <div className='md:w-3/4 md:flex md:mx-auto md:justify-center items-center mb-5'>
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
               htmlFor="form-material-name">
          Material Name
        </label>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="form-material-name"
            onChange={e => submissionDispatch({type: 'MATERIAL_NAME_CHANGE', payload: e.target.value})}
            value={submissionState.materialName}
          >
            {materialNameOptions.map((materialName) => {
              return <option key={materialName}>{materialName}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      <hr className='mb-5'/>
      <h4 className='text-center text-3xl font-bold mb-4'>Environment Conditions</h4>
      <div className="md:flex md:items-center md:justify-center mb-6">
        <label className="block text-gray-500 font-bold">
          <input className="mr-2 leading-tight" type="checkbox" checked={submissionState.useCustomEnvironmentConditions} id="custom-env-checkbox"
                 onChange={e => submissionDispatch({
                   type: 'SET_CUSTOM_ENVIRONMENT_CONDITIONS',
                   payload: e.target.checked
                 })}/>
          <span className="text-sm">
              I will upload new Environment Conditions
            </span>
        </label>
      </div>
      <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        {environmentConditionsForm}
      </div>
      <hr className='mb-5'/>
      <h4 className='text-center text-3xl font-bold mb-4'>Furnace</h4>
      <div className="md:flex md:items-center md:justify-center mb-6">
        <label className="block text-gray-500 font-bold">
          <input className="mr-2 leading-tight" type="checkbox" id="custom-fur-checkbox"
                 onChange={e => submissionDispatch({type: 'SET_CUSTOM_FURNACE', payload: e.target.checked})}/>
          <span className="text-sm">
              I will upload a new Furnace
            </span>
        </label>
      </div>
      <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        {furnaceForm}
      </div>
      <hr className='mb-5'/>
      <h4 className='text-center text-3xl font-bold mb-4'>Substrate</h4>
      <div className="md:flex md:items-center md:justify-center mb-6">
        <label className="block text-gray-500 font-bold">
          <input className="mr-2 leading-tight" type="checkbox" id="custom-sub-checkbox"
                 onChange={e => submissionDispatch({
                   type: 'SET_CUSTOM_SUBSTRATE',
                   payload: e.target.checked
                 })}/>
          <span className="text-sm">
              I will upload a new Substrate
            </span>
        </label>
      </div>
      <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        {substrateForm}
      </div>
      
      <hr className='mb-5'/>
      <h4 className='text-center text-3xl font-bold mb-4'>Properties</h4>
      <div className="md:flex md:items-center md:justify-center mb-6">
        <label className="block text-gray-500 font-bold">
          <input className="mr-2 leading-tight" type="checkbox" id="custom-prop-checkbox"
                 onChange={e => submissionDispatch({
                   type: 'SET_CUSTOM_PROPERTIES',
                   payload: e.target.checked
                 })}/>
          <span className="text-sm">
              I will upload new Properties
            </span>
        </label>
      </div>
      <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        {propertiesForm}
      </div>

      </div>
      <div className='md:w-1/2 flex flex-col border p-3'>

      <h4 className='text-center text-3xl font-bold mb-4'>Recipe</h4>
      <div className="md:flex md:items-center md:justify-center mb-6">
        <label className="block text-gray-500 font-bold">
          <input className="mr-2 leading-tight" type="checkbox" id="custom-rec-checkbox"
                 onChange={e => submissionDispatch({type: 'SET_CUSTOM_RECIPE', payload: e.target.checked})}/>
          <span className="text-sm">
              I will upload a new Recipe
            </span>
        </label>
      </div>
      <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        {recipeForm}
      </div>
      <hr className='mb-5'/>
      <h4 className='text-center text-3xl font-bold mb-4'>Authors</h4>
      <div className="md:w-3/4 md:flex md:flex-col md:items-center md:justify-center mb-6 mx-auto">
        {authorsForm}
      </div>

      <hr className='mb-5'/>
      <div className="flex justify-center">
        <div className="mb-3 w-96">
          <label htmlFor="sem-files" className="form-label inline-block mb-2 text-gray-700">
            SEM File(s)
          </label>
          <input className="form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 type="file" id="sem-files"
                 onChange={e => submissionDispatch({type: 'UPLOAD_SEM_FILES', payload: e.target.files})}
                 multiple/>
        </div>
      </div>

      <hr className='mb-5'/>
      <div className="flex justify-center">
        <div className="mb-3 w-96">
          <label htmlFor="raman-files" className="form-label inline-block mb-2 text-gray-700">
            RAMAN File(s)
          </label>
          <input className="form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 type="file" id="raman-files"
                 onChange={e => submissionDispatch({type: 'UPLOAD_RAMAN_FILES', payload: e.target.files})}
                 multiple/>
        </div>
      </div>

      {/*me add date also later */}
      {ownerGroups.length > 0  && (
      <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        <div>
          <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4"
                 htmlFor="owner-submit">
            Owner
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="owner-submit"
            onChange={e => submissionDispatch({
              type: 'OWNER_CHANGE', payload: e.target.value
            })}
            value={submissionState.ownerNumber}
            required
          >
            <option value="" disabled>    Select    </option>
            {ownerGroups.map((owner) => {
              return <option key={owner}>{owner}</option>
            })}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        </div>
        )}

        <div className="md:w-3/4 md:flex md:items-center md:justify-center mb-6 mx-auto">
        <div>
          <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4"
                 htmlFor="visibility-submit">
            Visibilty
          </label>
        </div>
        <div className="md:w-1/3 relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="visibility-submit"
            onChange={e => submissionDispatch({
              type: 'VISIBILITY_CHANGE', payload: e.target.value
            })}
            value={submissionState.visibility}
            required
          >  
          <option value="" disabled>    Select    </option>
          {ownerGroups.length > 0  && (<option key="GROUP">GROUP</option>)}
          <option key="PRIVATE">PRIVATE</option>
          <option key="PUBLIC">PUBLIC</option>  
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        </div>

      </div>
      </div>

      <hr className='mb-5'/>
      <button
        className="w-1/12 self-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSubmitExperiment}>
        Submit
      </button>
      
    </>
  )
}

export default ToolSubmit