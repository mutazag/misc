import React, { useState, useRef } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioURL, setAudioURL] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textFileURL, setTextFileURL] = useState(null);
  const [textFileName, setTextFileName] = useState('');
  const audioRef = useRef(null);

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

  // Dummy text-to-speech function
  const generateSpeech = () => {
    console.log('Starting speech generation for text:', text);
    setIsGenerating(true);
    
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
    
    // Simulate API call delay
    console.log('Simulating API call for speech generation...');
    setTimeout(() => {
      console.log('Creating audio context and generating audio data');
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Create dummy audio - a simple tone sequence
      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Generate audio data
      const audioData = [];
      const sampleRate = 44100;
      const duration = 3; // seconds
      
      for (let i = 0; i < sampleRate * duration; i++) {
        const t = i / sampleRate;
        // Generate a tone based on character codes to simulate voice
        const frequency = 220 + (text.charCodeAt(i % text.length) % 20) * 10;
        const sample = Math.sin(2 * Math.PI * frequency * t);
        audioData.push(sample * 0.5);
      }
      
      // Convert to wav format
      const buffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      buffer.getChannelData(0).set(audioData);
      
      // Convert buffer to wav blob
      const encodeWAV = (samples) => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);
        
        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        
        // fmt sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, 1, true); // mono
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); // byte rate
        view.setUint16(32, 2, true); // block align
        view.setUint16(34, 16, true); // bits per sample
        
        // data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);
        
        // Write the PCM samples
        const volume = 0.5;
        for (let i = 0; i < samples.length; i++) {
          const sample = Math.max(-1, Math.min(1, samples[i])) * volume;
          view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        }
        
        return view;
      };
      
      const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      // Create blob and URL
      console.log('Audio generation complete, creating blob URL');
      const wavView = encodeWAV(audioData);
      const blob = new Blob([wavView], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setAudioURL(url);
      setIsGenerating(false);
      console.log('Speech generation completed successfully');
    }, 1500);
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
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default TextToSpeech;
