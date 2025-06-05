import React from 'react';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      minWidth: '100vw',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1a1a1a',
      color: '#ffffff'
    }}>
      <div style={{
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '1.5rem',
        borderRadius: '12px',
        width: '85%',
        maxWidth: '400px',
        margin: '0 auto',
        fontWeight: 'bold',
        fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Eylül ayında yurt yemek listesine ek olarak<br />
        üniversite yemekleri ve otobüs saati<br />
        gösterimi ile beraber tekrar aktif olacaktır.<br /><br />
        <strong>İYİ TATİLER</strong>
      </div>
    </div>
  );
}

export default App;
