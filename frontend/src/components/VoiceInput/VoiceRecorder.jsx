import { useState, useRef } from "react";

export default function VoiceRecorder({ onTranscription }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  function startRecording() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true; 

    recognition.onresult = (e) => {
      let temp = "";

      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r[0].transcript;

        if (r.isFinal) {
          finalTranscriptRef.current += " " + text;
        }

        temp = text;
      }

      onTranscription(temp, false);
    };

    recognition.onend = () => {
      if (recording) {
        
        recognition.start();
      } else {
        
        onTranscription(finalTranscriptRef.current.trim(), true);
      }
    };

    finalTranscriptRef.current = "";
    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  }
  

  function stopRecording() {
    setRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
  }

  

  return (
    <div>
      {!recording ? (
        <button type="button" className="rec-btn" onClick={startRecording}>
          🎙 Start
        </button>
      ) : (
        <button type="button" className="stop-btn" onClick={stopRecording}>
          ⛔ Stop
        </button>
      )}
    </div>
  );
}
