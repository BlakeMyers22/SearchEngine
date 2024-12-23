const { Configuration, OpenAIApi } = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = JSON.parse(event.body);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",  // or gpt-3.5-turbo if you prefer
      messages: [
        {
          role: "system",
          content: "You are a helpful search assistant. Please provide relevant information for the query."
        },
        {
          role: "user",
          content: query
        }
      ],
    });

    const response = completion.data.choices[0].message.content;
    
    const results = [{
      title: "Search Result",
      snippet: response,
      url: "#"
    }];

    return {
      statusCode: 200,
      body: JSON.stringify({ results }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process search' }),
    };
  }
};
