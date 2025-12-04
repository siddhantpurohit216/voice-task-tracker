import { useState, useRef } from "react";

export default function VoiceRecorder({ onTranscription }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  function startRecording() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");

      onTranscription(transcript);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <div>
      {!recording ? (
        <button className="rec-btn" onClick={startRecording}>🎙 Start</button>
      ) : (
        <button className="stop-btn" onClick={stopRecording}>⛔ Stop</button>
      )}
    </div>
  );
}
