import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = 5000;
app.use(bodyParser.json());


// CHATGPT

import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

const numberResponses = 1;

const runPrompt = async(numberResponses) =>{

  let groupResponses = [];

          const prompt = `

          Generate an SEO-optimized neuroscience article with the following details.

          One title, one intro paragraph. 5 minimum, 8 maximum paragraphs of content. 
          
          You can group with coherence the content of two paragraphs and create a subtitle accordingly to this paragraphs. Maximum 3 subtitles.
          
          Ensure that the images are empty strings, and the 6 keywords maximum should be related to achieving the best SEO possible, in coherence with the content of the text and the title of the article.
          
          Format your response using the following JSON structure, no extra text, no "\n". 
          Verify al the ',' and brackets are in fact in the json response so it doenst return an error.
          The JSON structure should be compact, without unnecessary line breaks or formatting elements like 'type' or 'value' fields. The structure should be:

          {
                  
            "title": {
              "type": "string"
            },
            "subtitle": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "intro": {
              "type": "string"
            },
            "paragraphs": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "keywords": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "image1": {
              "type": "string",
              "format": "uri"
            },
            "image2": {
              "type": "string",
              "format": "uri"
            }
          },
          "required": ["_id", "title", "subtitle", "intro", "paragraphs", "keywords"]
        }
           
  `;
  

  for (let i = 0; i < numberResponses; i++) {
    try {
      const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 3600,
        temperature: 1.2,
      });

      console.log(response.choices[0].text);
      const jsonResponse = JSON.parse(response.choices[0].text);
      groupResponses.push(jsonResponse);
    } catch (error) {
      console.error('Error in OpenAI call:', error);
      throw error; // re-throw the error to be caught in the route handler
    }
  }

  // If you're expecting just one response, return the first element
  if (groupResponses.length === 1) {
    return groupResponses[0];
  } else {
    // If multiple responses are expected, return the array
    return groupResponses;
  }
}

//  runPrompt(numberResponses);


// DB CONNECTION

import mongoose from "mongoose";
import config from './config.js';



main().catch(err => console.log("db connection error"));

async function main() {
  await mongoose.connect(config.dbURL);
 
  console.info("connected to the db");
  
}

import articleObj from './models/channel.js';

// ROUTES

app.use('/users', usersRoutes );




app.get('/insert', async (req, res) => {
  try {
    let newArticleData = await runPrompt(numberResponses);
    
    // Check if newArticleData is a string and parse it
    if (typeof newArticleData === 'string') {
      newArticleData = JSON.parse(newArticleData);
    }
    
    console.log('New Article Data:', newArticleData);

    const savedArticle = await articleObj.create(newArticleData);
    res.json(savedArticle);
  } catch (error) {
    console.error('Error inserting article:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.use('/', (req, res) => { res.send('Hello world!'); }); 



app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));