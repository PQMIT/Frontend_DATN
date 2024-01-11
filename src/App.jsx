import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from './logo.svg';
import './App.css';

function App() {
  const { t } = useTranslation();
  /* const urlEndpoint = 'https://upload.imagekit.io/api/v1/files/upload';
  const publicKey = 'public_Va15YIq9hbYBZ6+DUk6ZevVa608=';
  const signature = 'YOUR_SIGNATURE';
  const expire = 'YOUR_EXPIRE';
  const token = 'YOUR_TOKEN'; */
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('learnReact')}
        </a>
      </header>
    </div>
  );
}

export default App;
