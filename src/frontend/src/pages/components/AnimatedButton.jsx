import React, { useState } from 'react';

const Button = ({ text, onClick }) => (
    <button
      style={{
        width: '150px',
        height: '100px',
        border: 'none',
        borderRadius: '5px',
        margin: '5px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );

const AnimatedButton = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };

  const buttonStyle = {
    padding: '0px 20px',
    backgroundColor: clicked ? 'green' : 'blue',
    color: '#fff',
    borderRadius: '5px',
    transition: 'background-color 0.5s ease',
    cursor: 'pointer',
  };

  return (
    <Button
      text={clicked ? 'Clicked!' : 'Click Me'}
      onClick={handleClick}
      style={buttonStyle}
    />
  );
};

export default AnimatedButton;