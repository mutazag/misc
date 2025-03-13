import React, { useState, useEffect, useRef } from 'react';

function SpeechToText() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const transcriptionIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Load available audio input devices when component mounts
  useEffect(() => {
    async function getAvailableDevices() {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Get list of audio input devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
        setDevices(audioInputDevices);
        
        if (audioInputDevices.length > 0) {
          setSelectedDevice(audioInputDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }

    getAvailableDevices();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
    };
  }, []);

  // Handle device selection change
  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  // Simulate transcription by adding words at intervals
  const simulateTranscription = () => {
    const words = [
      "Hello", "this", "is", "a", "simulated", "transcription", "of", "speech", 
      "to", "text", "conversion", "that", "mimics", "real-time", "processing", 
      "of", "audio", "input", "from", "the", "selected", "microphone", "device", 
      "on", "your", "computer", "or", "mobile", "device", "."
    ];
    
    let wordIndex = 0;
    
    transcriptionIntervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        setTranscription(prev => prev + " " + words[wordIndex]);
        wordIndex++;
      } else {
        // Reset word index to cycle through words again
        wordIndex = 0;
        setTranscription(prev => prev + "\n");
      }
    }, 300); // Add a new word every 300ms
  };

  // Toggle recording state
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
    } else {
      // Start recording
      try {
        const constraints = {
          audio: {
            deviceId: { exact: selectedDevice }
          }
        };
        
        streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Reset audio chunks and URL
        audioChunksRef.current = [];
        setAudioURL(null);
        
        // Configure MediaRecorder to collect audio data
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.onstop = () => {
          // Create blob from collected chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
        };
        
        mediaRecorderRef.current.start();
        
        // For demonstration, simulate transcription
        simulateTranscription();
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
    
    setIsRecording(!isRecording);
  };

  // Clear transcription and reset audio
  const clearTranscription = () => {
    setTranscription('');
    setAudioURL(null);
    if (audioChunksRef.current.length > 0) {
      audioChunksRef.current = [];
    }
  };

  // Download the recorded audio
  const downloadAudio = () => {
    if (audioURL) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = audioURL;
      a.download = `recording-${new Date().toISOString()}.mp3`;
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="speech-to-text">
      <div className="controls">
        <div className="device-selector">
          <label htmlFor="microphone-select">Select Microphone:</label>
          <select 
            id="microphone-select" 
            value={selectedDevice} 
            onChange={handleDeviceChange}
            disabled={isRecording}
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.substring(0, 5)}...`}
              </option>
            ))}
          </select>
        </div>

        <div className="recording-controls">
          <button 
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          <button 
            className="clear-button"
            onClick={clearTranscription}
          >
            Clear Transcription
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
      </div>
      
      <div className="transcription-container">
        <h2>Transcription</h2>
        <textarea 
          className="transcription-text"
          value={transcription}
          readOnly
        />
      </div>
    </div>
  );
}

export default SpeechToText;
