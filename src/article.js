// UNDER DEVELOPMENT
const axios = require('axios');
const cheerio = require('cheerio');

const API_KEY = 'AIzaSyDqYP_r-d-QEPavuriAbb1W9fGX2D335u8';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID';
const query = 'your search query';

const searchGoogle = async (query) => {
    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: API_KEY,
                cx: SEARCH_ENGINE_ID,
                q: query
            }
        });

        const results = response.data.items;
        return results.map(item => item.link);
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
};

const fetchPageContent = async (url) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const content = $('body').text(); // This extracts the text content of the body tag. Adjust as needed.
        return content;
    } catch (error) {
        console.error('Error fetching page content:', error);
        throw error;
    }
};

const main = async () => {
    try {
        const urls = await searchGoogle(query);
        for (const url of urls) {
            const content = await fetchPageContent(url);
            console.log('Content of', url, ':');
            console.log(content);
            console.log('--------------------------------');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

main();
