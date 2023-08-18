import React from 'react';

const Unauthorized: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    background: '#f4f4f4',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    color: '#666',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404 - Página no encontrada</h1>
      <p style={messageStyle}>Lo sentimos, la página que estás buscando no existe.</p>
    </div>
  );
};

export default Unauthorized;
