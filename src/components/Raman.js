import React, { useState, useEffect, useContext } from 'react';
import { Scatter } from 'react-chartjs-2';
import { ExperimentContext } from '../pages/ExperimentView';
import { getRandomInt } from '../utils/math';
import axios from 'axios';
import { showAlert } from './CustomAlert';

const Raman = () => {
  const { ramanFiles } = useContext(ExperimentContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!ramanFiles) {
        return;
      }

      const ramanData = [];

      for (let i = 0; i < ramanFiles.length; i++) {
        const ramanFile = ramanFiles[i];

        try {
          const response0 = await axios.post(
            process.env.REACT_APP_C3_URL + '/api/1/' + process.env.REACT_APP_C3_TENANT + '/' + process.env.REACT_APP_C3_TAG + '/AzureFile',
            { 'this': ramanFile.file },
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
          const url = response0.data;

          const response = await axios.get(url);
          const lines = response.data.split('\n');

          for (const line of lines) {
            const parts = line.split('\t');
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);

            if (!isNaN(x) && !isNaN(y)) {
              ramanData.push({ x, y });
            }
          }
        } catch (error) {
          showAlert('Error fetching data:', error);
        }
      }

      if (ramanData.length > 0) {
        const chartData = {
          datasets: ramanFiles.map((ramanFile, i) => ({
            label: `Raman data ${i + 1}`,
            data: ramanData,
            backgroundColor: `rgba(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, 1)`,
          })),
        };
        setData(chartData);
      }
    };

    fetchData();
  }, [ramanFiles]);

  if (!data || data.datasets.length === 0) {
    return <p className="text-center">No data available</p>;
  }

  return <Scatter options={{}} data={data} />;
};

export default Raman;

// import React, { useState, useEffect, useContext } from 'react';
// import { Scatter } from 'react-chartjs-2';
// import { ExperimentContext } from '../pages/ExperimentView';
// import { getRandomInt } from '../utils/math';
// import axios from 'axios';
// import { showAlert } from './CustomAlert';

// const Raman = () => {
//   const { ramanFiles } = useContext(ExperimentContext);
  
//   const data = {
//     datasets: []
//   }

//   // const fetchData = async () => {
//       const ramanData = [];
//       if (!ramanFiles) {
//         return <p className="text-center">No result</p>;
//       }

//       console.log(ramanFiles.length)
//       for (let i = 0; i < ramanFiles.length; i++) {
//         const ramanFile = ramanFiles[i];
//         //console.log(ramanFile)
//         const response0 =  axios.post(
//           process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/AzureFile', 
//           {'this':ramanFile.file}, 
//           {
//               params: {
//                   'action': 'generatePresignedUrl'
//               },
//               headers: {
//                   'authorization': 'Bearer '+  window.localStorage.getItem('token'),
//                   'accept': 'application/json', //xml
//                   'content-type': 'application/json'
//               }
//           } 
//         );
//        //console.log(response0)
//         const url = response0.data;//"https://devrconestore01.blob.core.windows.net/dev-rcone/fs/grdb/devgrdb/RamanFile/tawfick-uiuc/EXP-BY/sample.txt/sample.txt?sig=9oq62suKkGWJypgasrwzc2oKT7UX4s4jV8qoxKI3iUQ%3D&se=2023-05-15T21%3A25%3A40Z&sv=2018-11-09&sp=r&sr=b";

//         try {
//           const response =  axios.get(url);
//           const lines = response.data.split('\n');

//           for (const line of lines) {
//             const parts = line.split('\t');
//             const x = parseFloat(parts[0]);
//             const y = parseFloat(parts[1]);

//             if (!isNaN(x) && !isNaN(y)) {
//               ramanData.push({ x, y });
//             }
//           }

//         } catch (error) {
//           showAlert('Error fetching data:', error);
//         }
//         const graphData = {
//           label: `Raman data ${i + 1}`,
//           data: ramanFile.data,
//           backgroundColor: `rgba(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, 1)`,
//         }
//         data.datasets.push(graphData)
//       }

      
//     //};

//     //fetchData();

//     return <Scatter options={{}} data={data} />;
// };

// export default Raman;