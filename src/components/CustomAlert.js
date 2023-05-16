import React from 'react';
import ReactDOM from 'react-dom';

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <h2>GrResq App Alert</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
  
// const showAlert = (message) => {
//   const alertRoot = document.createElement('div');
//   alertRoot.className = 'custom-alert-root';
//   document.body.appendChild(alertRoot);

//   ReactDOM.render(
//     <CustomAlert message={message} onClose={() => closeAlert(alertRoot)} />,
//     alertRoot
//   );
// };

const showAlert = (message, duration = 3000) => {
    const alertRoot = document.createElement('div');
    alertRoot.className = 'custom-alert-root';
    document.body.appendChild(alertRoot);
  
    ReactDOM.render(
      <CustomAlert message={message} onClose={() => closeAlert(alertRoot)} />,
      alertRoot
    );
  
    setTimeout(() => {
      closeAlert(alertRoot);
    }, duration);
  };
  
const closeAlert = (alertRoot) => {
  ReactDOM.unmountComponentAtNode(alertRoot);
  alertRoot.parentNode.removeChild(alertRoot);
};

export { showAlert };
