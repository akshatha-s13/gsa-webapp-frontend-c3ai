import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import {ExperimentContext} from "../pages/ExperimentView";
import UTIF from "utif";
import { Stage, Layer, Image } from "react-konva";

const Sem = () => {
  const { semFiles } = useContext(ExperimentContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!semFiles) {
        return;
      }

      const urls = [];

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
        } catch (e) {
          console.log(e)
        }
      }
      console.log(urls)
      setData(urls);
    };

    fetchData();
  }, [semFiles]);

  if (!semFiles || semFiles.length === 0) {
    return <p className='text-center'>No result</p>
  }

  return (
    // <>
    //   {data.map((semFileUrl, i) => (
    //     <TiffToPng key={i} tiffUrl={semFileUrl} />
    //   ))}
    // </>
    <>
    {data.map((semFileUrl, i) => (
      <div key={i} style={{ margin: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <TiffToPng tiffUrl={semFileUrl} />
      </div>
    ))}
    </>
  );
};

const TiffToPng = ({ tiffUrl }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", tiffUrl);
    xhr.responseType = "arraybuffer";
    xhr.onload = (e) => {
      const ifds = UTIF.decode(e.target.response);
      const firstPageOfTif = ifds[0];
      UTIF.decodeImages(e.target.response, ifds);
      const rgba = UTIF.toRGBA8(firstPageOfTif);

      const imageWidth = firstPageOfTif.width;
      const imageHeight = firstPageOfTif.height;

      const cnv = document.createElement("canvas");
      cnv.width = imageWidth;
      cnv.height = imageHeight;

      const ctx = cnv.getContext("2d");
      const imageData = ctx.createImageData(imageWidth, imageHeight);
      for (let i = 0; i < rgba.length; i++) {
        imageData.data[i] = rgba[i];
      }
      ctx.putImageData(imageData, 0, 0);

      setImage(cnv);
    };
    xhr.send();
  }, [tiffUrl]);

  if (!image) {
    return null;
  }

  return (
    // <Stage width={image.width} height={image.height}>
    //   <Layer>
    //     <Image image={image} />
    //   </Layer>
    // </Stage>
    <Stage width={800} height={600}>
      <Layer>
        <Image image={image} width={800} height={600} />
      </Layer>
    </Stage>
  );
};

export default Sem;