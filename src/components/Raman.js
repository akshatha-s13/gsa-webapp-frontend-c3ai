import React, {useContext} from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import {ExperimentContext} from "../pages/ExperimentView";
import {getRandomInt} from "../utils/math";
import axios from "axios";

const Raman = () => {
  const {ramanFiles} = useContext(ExperimentContext)
  if (!ramanFiles || ramanFiles.length === 0) {
    return <p className='text-center'>No result</p>
  }

  const data = {
    datasets: []
  }

  ramanFiles.forEach((ramanFile, i) => {

    //me console.log(typeof(ramanFile))
    // console.log(ramanFile)
    // axios.post(
    //   process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/RamanFile', 
    //   {spec: {filter:"id=='"+ramanFile.id+"'"}}, 
    //   {
    //       params: {
    //           'action': 'fetch'
    //       },
    //       headers: {
    //           'authorization': 'Bearer '+ window.localStorage.getItem('token'),
    //           'accept': 'application/json', //xml
    //           'content-type': 'application/json'
    //       }
    //   }
    // ).then(response1 => {
    //   console.log(response1.data);
    //   const response =  axios.post(
    //     process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/RamanFile', 
    //     {'this': {'id':response1.data.objs[0].id,'file': response1.data.objs[0].file},'localDir':'.'}, //{'id':ramanFile.id, 'file':ramanFile.file} // response1.data.objs[0]
    //     {
    //         params: {
    //             'action': 'download'
    //             // 'this': ramanFile, //{'type': 'RamanFile', 'id': ramanFile.id},
    //             // 'localDir': '.'
    //         },
    //         headers: {
    //             'authorization': 'Bearer '+ window.localStorage.getItem('token'),
    //             'accept': 'application/json', //xml
    //             'content-type': 'application/json'
    //         }
    //     }
    //   ); 
    //   console.log(response.data) 
    // }).catch(error => {
    //   console.error(error);
    //me });


    //const data=response.data.objs
    
  //   axios.post(
  //     process.env.REACT_APP_C3_URL+'/'+'file/1/grdb/devgrdb/azure://dev-rcone/fs/grdb/devgrdb/RamanFile/tawfick-uiuc/EXP-JZ5/KZPd_170926-2_Raman1.txt', 
  //       {
  //           headers: {
  //               'Authorization': 'Bearer '+ window.localStorage.getItem('token'),
  //               'Accept': 'text/plain',
  //               'Access-Control-Allow-Origin': '*'
  //               // 'accept': 'application/json', //xml
  //               // 'content-type': 'application/json'
  //           }
  //       }
  //   ).then(response => {
  //     console.log(response.data);
  // }).catch(error => {
  //     console.error(error);
  // });

//   axios.post(
//     ramanFile.boxUrl, 
//       {
//           headers: {
//             'Authorization': 'Bearer '+ window.localStorage.getItem('token'),
//               'Access-Control-Allow-Origin': '*'
//               //'accept': 'application/json', //xml
//               // 'content-type': 'application/json'
//           }
//       }
//   ).then(response => {
//     console.log(response.data);
// }).catch(error => {
//     console.error(error);
// });

  // fetch(ramanFile.boxUrl,{mode:'no-cors'})
  //   .then(response => response.text())
  //   .then(text => {
  //     // Do something with the text content
  //     console.log(text);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });

    fetch(process.env.REACT_APP_C3_URL+'/'+'file/1/grdb/devgrdb/azure://dev-rcone/fs/grdb/devgrdb/RamanFile/tawfick-uiuc/EXP-JZ5/KZPd_170926-2_Raman1.txt', {
      mode: 'no-cors',
      headers: {
        'Authorization': window.localStorage.getItem('adminToken')
      }
    })
    .then(response => response.text())
    .then(text => {
      // Do something with the text content
      console.log(text);
    })
    .catch(error => {
      console.error(error);
    });

    // //     // console.log(data1)
    // //     // const ramanData = {
    // //     //   label: `Raman data ${i + 1}`,
    // //     //   data: data1,
    // //     //   backgroundColor: `rgba(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, 1)`,
    // //     // }
    // //     // data.datasets.push(ramanData)
    // //   })
    //   .catch(error => console.log(error));
  })

  return (
    <Scatter
      options={{}}
      data={data}
    />
  )
}

export default Raman