// import React, { useEffect, useState } from 'react';

// const TiffToImage = ({ tiffUrl }) => {
//   const [imageSrc, setImageSrc] = useState(null);

//   useEffect(() => {
//     const convertTiffToImage = async () => {
//       try {
//         const response = await fetch(tiffUrl);
//         const blob = await response.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setImageSrc(imageUrl);
//       } catch (error) {
//         console.error('Error loading TIFF file:', error);
//       }
//     };

//     convertTiffToImage();
//   }, [tiffUrl]);

//   return imageSrc ? <img src={imageSrc} alt="TIFF Image" /> : null;
// };

// export default TiffToImage;
//2
// import React, { useEffect, useRef } from 'react';

// const TiffToImage = ({ tiffUrl }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const convertTiffToImage = async () => {
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       const image = new Image();
//       image.onload = () => {
//         canvas.width = image.width;
//         canvas.height = image.height;
//         context.drawImage(image, 0, 0, image.width, image.height);
//       };

//       const response = await fetch(tiffUrl);
//       const blob = await response.blob();
//       image.src = URL.createObjectURL(blob);
//     };

//     convertTiffToImage();
//   }, [tiffUrl]);

//   return <canvas ref={canvasRef} />;
// };

// export default TiffToImage;

// import React, { useEffect, useRef, useState } from 'react';
// import { decodeTIFF } from 'tiff.js';

// const TiffToImage = ({ tiffUrl }) => {
//   const canvasRef = useRef(null);
//   const [error, setError] = useState(false);
//   // Convert RGBA image data from TIFF to standard RGBA format
// const tiffRGBAtoRGBA = (tiff) => {
//   const rgbaData = new Uint8Array(tiff.width * tiff.height * 4);
//   const tiffData = new Uint32Array(tiff.buffer);

//   for (let i = 0; i < tiffData.length; i++) {
//     const tiffPixel = tiffData[i];
//     const rgbaOffset = i * 4;

//     const r = (tiffPixel >> 24) & 0xff;
//     const g = (tiffPixel >> 16) & 0xff;
//     const b = (tiffPixel >> 8) & 0xff;
//     const a = tiffPixel & 0xff;

//     rgbaData[rgbaOffset] = r;
//     rgbaData[rgbaOffset + 1] = g;
//     rgbaData[rgbaOffset + 2] = b;
//     rgbaData[rgbaOffset + 3] = a;
//   }

//   return rgbaData;
// };

//   useEffect(() => {
//     const convertTiffToImage = async () => {
//       try {
//         const response = await fetch(tiffUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         const tiff = await decodeTIFF(arrayBuffer);
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         canvas.width = tiff.width;
//         canvas.height = tiff.height;

//         const imageData = context.createImageData(tiff.width, tiff.height);
//         imageData.data.set(tiffRGBAtoRGBA(tiff));
//         context.putImageData(imageData, 0, 0);
//       } catch (error) {
//         setError(true);
//         console.error('Error loading TIFF file:', error);
//       }
//     };

//     convertTiffToImage();
//   }, [tiffUrl]);

//   return error ? (
//     <div>Error loading TIFF file</div>
//   ) : (
//     <canvas ref={canvasRef} />
//   );
// };

// export default TiffToImage;

import React, { useEffect, useRef } from 'react';

const TiffToImage = ({ tiffUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const convertTiffToImage = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        // Convert the canvas content to JPEG format
        const imageDataURL = canvas.toDataURL('image/jpeg');
        const jpegImage = new Image();
        jpegImage.src = imageDataURL;

        // Display the converted JPEG image
        document.body.appendChild(jpegImage);
      };

      const response = await fetch(tiffUrl);
      const blob = await response.blob();
      image.src = URL.createObjectURL(blob);
    };

    convertTiffToImage();
  }, [tiffUrl]);

  return <canvas ref={canvasRef} />;
};

export default TiffToImage;
