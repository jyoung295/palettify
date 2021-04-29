import React from "react";

const ProgressBar = (props) => {
  const { phase, progress } = props;

  //css in js 🤔
  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: `${progress < 66 ? ( progress < 33 ? '#e32636' : '#ffe135') : '#98fb98'}`,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  return (
    <div className="progress-box">
      <div className="progress-caption">
        <p>
          {phase === 'isCollectingPixelData' && 'Digesting image data and determining your palette...'}
        </p>
      </div>
      <div className="progress-container" style={containerStyles}>
        <div className="progress-bar" style={fillerStyles}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
