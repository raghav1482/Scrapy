import React, { useState } from 'react';
import '../styles/LandingPage.css';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from "axios";
import { saveAs } from 'file-saver';

const Home = () => {
    const [search_url ,setUrl]=useState("");
    const [result,setResult]=useState();
    const [loader , setLoad] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        try {
            const response = await axios.get(`http://localhost:3000/scrape-reviews?url=${search_url}`);
            
            // Convert result to a Blob and save as JSON file
            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
            setResult(blob);
            setLoad(false);
        } catch (e) {
            setLoad(false);
            console.log(e);
        }
    }

    console.log(result);

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
                        <button type='submit'>{(loader===false)?<i className='fa fa-search'></i>:<span className='loader'></span>}</button>
                    </form>
                    <div className="cta-buttons">
                        {!loader && <button className="start-trial-button" onClick={()=>{saveAs(result, 'result.json')}}>DOWNLOAD JSON</button>}
                        {/* <button className="learn-more-button">Learn More</button> */}
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
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Home;
