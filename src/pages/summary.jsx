import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion, Button } from "flowbite-react";
import axios from "axios";

const Summary = () => {
    const { id } = useParams();
    const [summaryData, setSummaryData] = useState([]);

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/get_summary/${id}`);
                setSummaryData(response.data);
                console.log(summaryData);
            } catch (error) {
                console.error('Error fetching summary data:', error);
            }
        };

        fetchSummaryData();
    }, [id]);

  return (
    <div className="min-h-screen bg-customBiru4 py-10 px-10">
      <div className="bg-white rounded shadow p-12">
        <div className="grid grid-cols-6 justify-center">
          <h2 className="text-3xl text-center font-extrabold mb-6 col-start-2 col-span-4">
            Let's Sum Up!
          </h2>
          <div className="">
            <Button gradientMonochrome="failure" pill>
              End Review
            </Button>
          </div>
        </div>
               <Accordion>
                    {summaryData.map((item, index) => (
                        <Accordion.Panel key={index}>
                            <Accordion.Title>Q{index + 1}. {item.question}</Accordion.Title>
                            <Accordion.Content>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">Answer: {item.answer}</p>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">Feedback: {item.feedback}</p>
                            </Accordion.Content>
                        </Accordion.Panel>
                    ))}
                </Accordion>
      </div>
    </div>
  );
};

export default Summary;
