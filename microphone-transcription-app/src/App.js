import React, { useState } from 'react';
import './App.css';
import SpeechToText from './components/SpeechToText';
import TextToSpeech from './components/TextToSpeech';

function App() {
  const [activeTab, setActiveTab] = useState('speech-to-text');

  // Handle tab change
  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app">
      <header>
        <h1>Azure AI Speech Service </h1>
      </header>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'speech-to-text' ? 'active' : ''}`}
          onClick={() => changeTab('speech-to-text')}
        >
          Speech to Text
        </button>
        <button 
          className={`tab-button ${activeTab === 'text-to-speech' ? 'active' : ''}`}
          onClick={() => changeTab('text-to-speech')}
        >
          Text to Speech
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'speech-to-text' ? (
          <SpeechToText />
        ) : (
          <TextToSpeech />
        )}
      </div>
    </div>
  );
}

export default App;
