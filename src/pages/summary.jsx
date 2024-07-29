import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, Button } from "flowbite-react";
import axios from "axios";
import StarRating from "../components/starRating";
import { useAuth } from "../context/AuthContext"; // Import the context

const Summary = () => {
  const { id } = useParams();
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context

  // Fetch summary data from the server
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_summary/${id}`);
        if (response.data && Array.isArray(response.data)) {
          setSummaryData(response.data);
        } else {
          throw new Error("Unexpected data format.");
        }
      } catch (error) {
        setError("Failed to fetch summary data.");
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [id]);

  // Calculate the average rating
  const averageRating = useMemo(() => {
    if (summaryData.length === 0) return 0;
    const totalRating = summaryData.reduce((acc, item) => acc + item.rating, 0);
    return Math.round(totalRating / summaryData.length);
  }, [summaryData]);

  // Handle the end review button click
  const handleEndReview = () => {
    navigate("/dashboard");
  };

  // Handle save summary
  const handleSaveSummary = async () => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/summary', {
        user_id: user.id,
        session_id: id,
        summaries: summaryData
      });
      console.log("Summary saved:", response.data);
    } catch (error) {
      console.error("Error posting summary to API:", error);
      alert("Failed to save summary. Please check the console for details.");
    }
  };

  // Render the component
  return (
    <div className="min-h-screen bg-customBiru4 py-10 px-10">
      <div className="bg-white rounded shadow p-12">
        <div className="grid grid-cols-6 justify-center mb-6">
          <h2 className="text-3xl text-center font-extrabold col-start-2 col-span-4">
            Rating and Reviews
          </h2>
          <div className="col-start-2 col-span-4 text-center">
            <Button onClick={handleEndReview} color="failure" pill>
              End Review
            </Button>
            <Button onClick={handleSaveSummary} color="success" pill className="ml-4">
              Save Summary
            </Button>
          </div>
        </div>
        {loading && <div className="text-center text-blue-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <div className="my-6 text-center">
              <h3 className="text-2xl font-bold">Total Score</h3>
              <StarRating rating={averageRating} />
            </div>
            <Accordion>
              {summaryData.map((item, index) => (
                <Accordion.Panel key={index}>
                  <Accordion.Title>
                    Q{index + 1}. {item.question}
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Answer: {item.answer}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Feedback: {item.feedback}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Rating: {item.rating}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Timestamp: {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Sample Answer: {item.sample_ans}
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;
