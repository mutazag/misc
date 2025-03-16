import React, { useState, useRef, useEffect } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioURL, setAudioURL] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textFileURL, setTextFileURL] = useState(null);
  const [textFileName, setTextFileName] = useState('');
  const [error, setError] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // Optional: to show audio duration
  const [currentTime, setCurrentTime] = useState(0); // Optional: to show current playback position

  const audioRef = useRef(null);
  const config = {
    speechRegion:process.env.REACT_APP_SPEECH_REGION,
    speechKey: process.env.REACT_APP_SPEECH_KEY,
    speakerProfileId: process.env.REACT_APP_SPEECH_PROFILEID
  };
  

  // Handle text input change
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Clear text and audio
  const clearText = () => {
    setText('');
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    if (textFileURL) {
      URL.revokeObjectURL(textFileURL);
      setTextFileURL(null);
      setTextFileName('');
    }
  };

  // Handle audio playback events
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => { setIsPlaying(true); };
      const handlePause = () => { setIsPlaying(false); };
      const handleEnded = () => { setIsPlaying(false); };
      const handleDurationChange = () => { setDuration(audioElement.duration); };
      const handleTimeUpdate = () => { setCurrentTime(audioElement.currentTime); };

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('durationchange', handleDurationChange);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);


      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('durationchange', handleDurationChange);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    } 
  }, [audioRef.current] );
  


  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) { 
        audioRef.current.pause(); 
      } else { 
        audioRef.current.play(); 
      }
      }
    };

  // Text-to-speech function with real API
  const generateSpeech = () => {
    console.log('Starting speech generation for text:', text);
    setIsGenerating(true);
    setError(null);
    
    // Create a text file URL but don't download automatically
    const createTextFileURL = () => {
      // Create a blob with the text content
      const textBlob = new Blob([text], { type: 'text/plain' });
      
      // Create a URL for the blob
      const fileURL = URL.createObjectURL(textBlob);
      const fileName = `speech-text-${new Date().toISOString()}.txt`;
      
      setTextFileURL(fileURL);
      setTextFileName(fileName);
      console.log('Text file URL created:', fileName);
    };
    
    // Create text file URL
    createTextFileURL();

  
    // Prepare SSML for the TTS API
    const ssml = `
      <speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis'
                                xmlns:mstts='http://www.w3.org/2001/mstts'>
                                <voice name='DragonLatestNeural'>
                                <mstts:ttsembedding speakerProfileId='${config.speakerProfileId}'/>
                                <lang xml:lang='ar-Jo'> ${text} </lang>
                                </voice></speak>
    `;

    //السلام المفقود: ما هي التحديات التي تعرقل تحقيق سلام دائم بين أوكرانيا وروسيا؟
    //en-AU
    //ar-jo
    
    // Replace with your actual endpoint and headers
    const endpoint = `https://${config.speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const headers = {
      'Ocp-Apim-Subscription-Key': config.speechKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      'User-Agent': 'TextToSpeechApp'
    };
    
    console.log('Sending request to TTS API...');
    
    fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: ssml
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('Response received from API');
      return response.blob();
    })
    .then(blob => {
      // Create a URL for the audio blob
      const url = URL.createObjectURL(blob);
      console.log('Audio blob URL created');
      
      // Set the state to update the UI
      setAudioURL(url);
      setIsGenerating(false);
      
      console.log('Speech generation completed successfully');
      
      // Auto play the audio if desired
      // if (audioRef.current) {
      //   audioRef.current.play();
      // }
    })
    .catch(error => {
      console.error('Error generating speech:', error);
      setError(`Error: ${error.message}`);
      setIsGenerating(false);
    });
  };

  // Download the generated audio
  const downloadAudio = () => {
    if (audioURL) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = audioURL;
      a.download = `text-to-speech-${new Date().toISOString()}.mp3`;
      a.click();
      document.body.removeChild(a);
    }
  };

  const onAudioLoad = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  return (
    <div className="text-to-speech">
      <div className="text-input-container">
        <textarea
          className="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to convert to speech..."
        />
      </div>
      
      <div className="tts-controls">
        <button
          className={`speak-button ${isGenerating ? 'generating' : ''}`}
          onClick={generateSpeech}
          disabled={isGenerating || !text.trim()}
        >
          {isGenerating ? 'Generating...' : 'Speak Text'}
        </button>
        
        <button
          className="clear-button"
          onClick={clearText}
        >
          Clear Text
        </button>
        
        {audioURL && (
          <button
            className="download-button"
            onClick={downloadAudio}
          >
            Download Audio
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {textFileURL && (
        <div className="text-file-download">
          <h3>Text Content</h3>
          <p>
            <a href={textFileURL} download={textFileName}>
              Download text as file ({textFileName})
            </a>
          </p>
        </div>
      )}
      
      {audioURL && (
        <div className="audio-player">
          <h3>Audio Preview</h3>
          <audio 
            ref={audioRef} 
            controls 
            src={audioURL}
            onLoadedData={onAudioLoad}
          >
            Your browser does not support the audio element.
          </audio>


        </div>
      )}


      {audioURL && (
        <div className="audio-duration">
          <p>Duration: {duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60)}` : 'Loading...'}</p>
          <p>Current Time: {currentTime ? `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)}` : 'Loading...'}</p>
        </div>
      )}

      {audioURL && (
        <div className="audio-controls">
          <button onClick={() => audioRef.current.currentTime -= 5}>Rewind 5s</button>
          <button onClick={() => audioRef.current.currentTime += 5}>Forward 5s</button>
        </div>
      )}

      {audioURL && (
        <div className="play-pause-button">
          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}



    </div>
  );
}

export default TextToSpeech;
