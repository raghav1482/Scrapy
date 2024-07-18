import React, { useState } from 'react';
import '../styles/LandingPage.css';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Home = ({ server_url }) => {
    const [search_url, setUrl] = useState("");
    const [result, setResult] = useState([]);
    const [loader, setLoad] = useState(false);
    const [sentimentProb, setSentimentProb] = useState(0);

    const sendRequest = async (res) => {
        try {
            // Assuming 'res.data' is the array of sentences
            const response = await axios.post(`https://senti-svm.onrender.com/predict`, { sentences: res.data });
            

            const sentiments = response?.data?.sentiments;
            
            if (sentiments) {
                // Extract the rating from the last element
                const ratingStr = res?.data[res?.data?.length - 1];
                const rating = parseFloat(ratingStr);
                
                let pos = 0, neg = 0;
                sentiments.slice(0, -1).forEach(element => {
                    if (element === "Positive") {
                        pos++;
                    } else {
                        neg++;
                    }
                });

                const avgSentiment = pos / (pos + neg);
                const avgRatingProbability = rating / 5; // Assuming rating is out of 5

                // Combine the average rating probability and average sentiment probability
                const combinedProbability = (0.4 * avgRatingProbability) + (0.6 * avgSentiment);
                setSentimentProb(combinedProbability);
            } else {
                console.log("No sentiments received");
            }
        } catch (error) {
            console.error("Error in sending request:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        if (search_url.startsWith("http")) {
            const parsedUrl = new URL(search_url);
            if (parsedUrl.hostname.includes('amazon.')) {
                try {
                    const response = await axios.get(`${server_url}/scrape-reviews?url=${search_url}`);
                    
                    setResult(response.data);
                    setLoad(false);

                    // Send the result to the sentiment analysis endpoint
                    await sendRequest(response);
                } catch (e) {
                    setLoad(false);
                    console.log(e);
                }
            } else {
                setLoad(false);
                alert("Enter a valid AMAZON URL🫥");
            }
        } else {
            setLoad(false);
            alert("Enter a valid AMAZON URL🫥");
        }
    };

    const getEmoji = (prob) => {
        if (prob >= 0.75) {
            return "😁"; // Very positive
        } else if (prob >= 0.5) {
            return "🙂"; // Positive
        } else if (prob >= 0.25) {
            return "😐"; // Neutral
        } else {
            return "😞"; // Negative
        }
    };

    const data = {
        labels: ['Sentiment Probability'],
        datasets: [
            {
                label: 'Probability',
                data: [sentimentProb],
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <Navbar />
            <div className='background'>
                <div></div>
            </div>
            <div className="landing-page">
                <main className="main-content">
                    <h1 className="headline">Scrapy, is here</h1>
                    <p className="description">
                        Scrapy elegantly empowers users to effortlessly scrape Amazon product reviews with modern efficiency and ease.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input type='text' onChange={(e) => { setUrl(e.target.value) }} className='input-search' />
                        <button type='submit'>{(loader === false) ? <i className='fa fa-search'></i> : <span className='loader'></span>}</button>
                    </form>
                    <div className="cta-buttons">
                        {/* Additional actions can be added here */}
                    </div>
                    <div className="code-screenshot">
                        <pre style={{ textAlign: "left" }}>
                            <code>
                                # Install necessary packages for web scraping<br />
                                npm install axios cheerio<br />

                                # Example script to scrape Amazon product reviews
                            </code>
                        </pre>
                    </div>
                    <div className="integration-icons">
                        {/* Add icons as needed */}
                    </div>
                    {sentimentProb > 0 && (
                        <div className="chart-container">
                            <Bar data={data} options={{ scales: { y: { beginAtZero: true, max: 1 } } }} />
                            <div className="emoji-display">
                                <p>Sentiment: {getEmoji(sentimentProb)}</p>
                            </div>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Home;
