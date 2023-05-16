import React, {useContext, useEffect, useState} from "react";
import {ExperimentContext} from "../pages/ExperimentView";
import TiffToImage from './TiffToImage';
import axios from 'axios';

const Sem = () => {
  const {semFiles} = useContext(ExperimentContext)
  
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!semFiles) {
        return;
      }

      const urls=[];

      for (let i = 0; i < semFiles.length; i++) {
        const semFile = semFiles[i];

        try {
          const response0 = await axios.post(
            process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/AzureFile',
            { 'this': semFile.file },
            {
              params: {
                'action': 'generatePresignedUrl'
              },
              headers: {
                'authorization': 'Bearer ' + window.localStorage.getItem('token'),
                'accept': 'application/json',
                'content-type': 'application/json'
              }
            }
          );
          urls.push(response0.data);
        }catch(e){
          console.log(e)
        }
      }
      console.log(urls)
      setData(urls)
    };

    fetchData();
  }, [semFiles]);

  if (!semFiles || semFiles.length === 0) {
    return <p className='text-center'>No result</p>
  }

  return (
    <>
      {data.map((semFileUrl, i) => {
        
        // return <img
        //   src={semFileUrl.boxUrl}
        //   alt={`Sem file ${i + 1}`}
        //   className='w-96 h-96 my-4'
        //   key={i}/> 
      //   <div>
      //   <p>HIIIII</p>
      return <TiffToImage tiffUrl={semFileUrl} />
      // </div>
      })}
    </>
  )  
}

export default Sem