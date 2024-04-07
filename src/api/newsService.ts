import axios from 'axios';

const fetchHealthcareNews = async () => {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        token: '9558f8e39732178b9e37eecd9a1ce12a', // Replace 'YOUR_API_KEY' with your actual API key
        topic: 'health',
        country: 'za', // Country code for Africa (South Africa)
        max: 70, // Limit the number of articles to 50
      },
    });

    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export default fetchHealthcareNews;
