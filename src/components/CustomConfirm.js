import React from 'react';
import ReactDOM from 'react-dom';

const CustomConfirm = ({ message, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm(true);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <h2>GrResq App Confirm</h2>
        <p>{message}</p>
        <div className="button-container">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const showConfirm = (message) => {
  return new Promise((resolve) => {
    const confirmRoot = document.createElement('div');
    confirmRoot.className = 'custom-alert-root';
    document.body.appendChild(confirmRoot);

    const handleConfirm = (confirmed) => {
      resolve(confirmed);
      closeConfirm(confirmRoot);
    };

    const handleCancel = () => {
      resolve(false);
      closeConfirm(confirmRoot);
    };

    ReactDOM.render(
      <CustomConfirm message={message} onConfirm={handleConfirm} onCancel={handleCancel} />,
      confirmRoot
    );
  });
};

const closeConfirm = (confirmRoot) => {
  ReactDOM.unmountComponentAtNode(confirmRoot);
  confirmRoot.parentNode.removeChild(confirmRoot);
};

export { showConfirm };
