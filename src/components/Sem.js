import React, {useContext, useState} from "react";
import {ExperimentContext} from "../pages/ExperimentView";
// import { Tiff } from "react-tiff";
// import Tiff from 'tiff.js' ;


const Sem = () => {
  const {semFileUrls} = useContext(ExperimentContext)
  const [dataUri,setDataUri] = useState("")
  if (!semFileUrls || semFileUrls.length === 0) {
    return <p className='text-center'>No result</p>
  }

  
  //   return (
  //   <>
  //     {/* <Tiff
  //         src={dataUri}
  //         alt={`Sem file `}
  //         className='w-96 h-96 my-4'
  //         /> */}
  //   </>
  // )

  // keep this, working on safari, delete rest
  return (
    <>
      {semFileUrls.map((semFileUrl, i) => {
        return <img
          src={semFileUrl.boxUrl}
          alt={`Sem file ${i + 1}`}
          className='w-96 h-96 my-4'
          key={i}/>
      })}
    </>
  )  

  // return (
  //   <>
  //     {semFileUrls.map((semFileUrl, i) => {
  //       return <Tiff
  //         src={semFileUrl.boxUrl}
  //         alt={`Sem file ${i + 1}`}
  //         className='w-96 h-96 my-4'
  //         key={i}/>
  //     })}
  //   </>
  // )
}

export default Sem