import React, { useState, useEffect } from "react";
import mic from "../assets/image/mic.jpg";
import { Accordion, Button } from "flowbite-react";
import axios from "axios";

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

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post("http://localhost:5000/questions");
        setQuestions(response.data.questions);
        setQuestion(response.data.questions[0].question);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

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
      setQuestion(questions[currentQuestionIndex]);
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorder.stop();
    setIsFeedback(true); // Set feedback session aktif setelah rekaman berhenti
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
        setQuestion(questions[nextIndex]);
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

  return (
    <div className="bg-gradient-to-b from-sky-100 to-white h-full">
      <div className="container mx-auto p-4 pt-12">
        <h1 className="text-3xl font-bold mb-8">INTERVIEW TEST</h1>
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
