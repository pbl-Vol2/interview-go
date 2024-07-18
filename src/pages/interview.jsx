import React, { useState, useEffect } from "react";
import mic from "../assets/image/mic.jpg";
import { Accordion, Button } from "flowbite-react";
import axios from "axios";
import { useParams } from 'react-router-dom';

function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [question, setQuestion] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFeedback, setIsFeedback] = useState(false); // Menambahkan state untuk melacak sesi feedback
  const [feedback, setFeedback] = useState(""); // Menambahkan state untuk menyimpan feedback
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [field, setField] = useState([]);
  const { code } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/questions', { code });
        console.log("Fetched questions:", response.data.questions);
        setQuestions(response.data.questions);
        const field = response.data.category ;
        setField(field);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [code]);

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isRecording]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleStopRecording();
      setTimeLeft(60);
    }
  }, [timeLeft]);

  const handleStartRecording = async () => {
    if (!hasPermission) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasPermission(true);
        setStream(stream);
      } catch (error) {
        console.error("Error requesting microphone permission:", error);
        return;
      }
    }

    if (hasPermission) {
      setIsRecording(true);
      setTimeLeft(120); // Reset timer to 120 seconds
      setQuestion(questions[currentQuestionIndex]);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      let recordedBlobs = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      };

      setMediaRecorder(mediaRecorder);
      setRecordedBlobs(recordedBlobs);
      mediaRecorder.start();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsFeedback(true);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedBlobs, { type: 'audio/webm' });
        const wavBlob = await convertWebmToWav(blob);
        await sendAudioToFlask(wavBlob);
      };
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value); // Menyimpan nilai feedback
  };

  const handleSubmitFeedback = () => {
    // Simpan feedback atau lakukan tindakan lain yang diperlukan
    console.log(
      "Feedback for question ${currentQuestionIndex + 1}: ${feedback}"
    );
    setFeedback(""); // Reset feedback
    setIsFeedback(false); // Selesai feedback session
    goToNextQuestion(); // Lanjut ke pertanyaan berikutnya
  };

  const goToNextQuestion = () => {
      setCurrentQuestionIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < questions.length) {
          setQuestion(questions[nextIndex].question);
          setTimeLeft(120); // Reset timer to 120 seconds for the new question
          setIsRecording(false); // Reset recording state
          return nextIndex;
        } else {
          alert("Interview selesai");
          return prevIndex;
        }
      });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const convertWebmToWav = async (webmBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(webmBlob);

      reader.onloadend = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(reader.result, (buffer) => {
          const wavBlob = bufferToWav(buffer);
          resolve(wavBlob);
        });
      };

      reader.onerror = reject;
    });
  };

    const bufferToWav = (buffer) => {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2 + 44;
    const bufferData = new ArrayBuffer(length);
    const view = new DataView(bufferData);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, length - 8, true);
    writeString(view, 8, 'WAVE');

    // FMT sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 4, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);

    // Data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length - 44, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const channel = buffer.getChannelData(i);
      for (let j = 0; j < channel.length; j++) {
        view.setInt16(offset, channel[j] * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sendAudioToFlask = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'audio.wav');
    formData.append('question', question);

    try {
      const response = await axios.post('http://127.0.0.1:5000/answer', formData, {
        headers: {
            'question' : question,
            'audio': 'multipart/form-data'
        },
      });
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error sending audio to Flask:', error);
    }
  };

  const postFeedbackToAPI = async (question, answer) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/feedback', {
        question,
        answer,
      });
      console.log('Feedback posted to API:', response.data);
    } catch (error) {
      console.error('Error posting feedback to API:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-100 to-white h-full">
      <div className="container mx-auto p-4 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-center">{field}</h1>
        <div className="flex justify-center items-center mb-4 gap-56">
          <Button color="light" pill>
            <i className="ri-arrow-left-line me-1"></i> Back
          </Button>
          <h2 className="font-semibold">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <Button color="light" pill>
            End & Review
          </Button>
        </div>
        <div className="bg-white shadow-md p-8 rounded-lg max-w-3xl mx-auto text-center h-full">
          <img src={mic} alt="Mic" className="w-40 rounded-lg mb-4 mx-auto" />
          <p className="text-xl font-bold mb-8">{question}</p>
          <p className="text-xl font-bold mb-8">
            <span className="bg-red-500 text-white rounded-lg p-3">
              {formatTime(timeLeft)}
            </span>
          </p>
          <div className="flex justify-center">
            {isRecording ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-full"
                onClick={handleStopRecording}
              >
                Stop Recording
              </button>
            ) : isFeedback ? (
              <div className="w-full">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full mb-3"
                  onClick={handleSubmitFeedback}
                >
                  Next Question
                </button>
                <div id="accordion-open" data-accordion="open">
                  <h2 id="accordion-open-heading-2">
                    <button
                      type="button"
                      class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                      data-accordion-target="#accordion-open-body-2"
                      aria-expanded="false"
                      aria-controls="accordion-open-body-2"
                    >
                      <span class="flex items-center">
                        <svg
                          class="w-5 h-5 me-2 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Is there a Figma file available?
                      </span>
                      <svg
                        data-accordion-icon
                        class="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5 5 1 1 5"
                        />
                      </svg>
                    </button>
                  </h2>
                  <div
                    id="accordion-open-body-2"
                    class="hidden"
                    aria-labelledby="accordion-open-heading-2"
                  >
                    <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                        Flowbite is first conceptualized and designed using the
                        Figma software so everything you see in the library has
                        a design equivalent in our Figma file.
                      </p>
                      <p class="text-gray-500 dark:text-gray-400">
                        Check out the{" "}
                        <a
                          href="https://flowbite.com/figma/"
                          class="text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Figma design system
                        </a>{" "}
                        based on the utility classes from Tailwind CSS and
                        components from Flowbite.
                      </p>
                    </div>
                  </div>
                  <h2 id="accordion-open-heading-2">
                    <button
                      type="button"
                      class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                      data-accordion-target="#accordion-open-body-2"
                      aria-expanded="false"
                      aria-controls="accordion-open-body-2"
                    >
                      <span class="flex items-center">
                        <svg
                          class="w-5 h-5 me-2 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Is there a Figma file available?
                      </span>
                      <svg
                        data-accordion-icon
                        class="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5 5 1 1 5"
                        />
                      </svg>
                    </button>
                  </h2>
                  <div
                    id="accordion-open-body-2"
                    class="hidden"
                    aria-labelledby="accordion-open-heading-2"
                  >
                    <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                        Flowbite is first conceptualized and designed using the
                        Figma software so everything you see in the library has
                        a design equivalent in our Figma file.
                      </p>
                      <p class="text-gray-500 dark:text-gray-400">
                        Check out the{" "}
                        <a
                          href="https://flowbite.com/figma/"
                          class="text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Figma design system
                        </a>{" "}
                        based on the utility classes from Tailwind CSS and
                        components from Flowbite.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full"
                onClick={handleStartRecording}
              >
                Start Recording
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
