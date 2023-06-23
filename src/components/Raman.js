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

      const datasets = [];

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

          const ramanData = []; // Separate ramanData for each file

          for (const line of lines) {
            const parts = line.split('\t');
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);

            if (!isNaN(x) && !isNaN(y)) {
              ramanData.push({ x, y });
            }
          }

          if (ramanData.length > 0) {
            datasets.push({
              label: `Raman data ${i + 1}`,
              data: ramanData,
              backgroundColor: `rgba(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, 1)`,
            });
          }
        } catch (error) {
          showAlert('Error fetching data:', error);
        }
      }

      if (datasets.length > 0) {
        const chartData = {
          datasets: datasets,
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