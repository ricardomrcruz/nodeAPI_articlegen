import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import cors from 'cors';


const app = express();
const PORT = 8000;


//DOUBLE SERVER RUNNING AT THE SAME TIME
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:5173'];

const options = {
  origin: allowedOrigins
};

// Then pass these options to cors:
app.use(cors(options));

app.use(express.json());



// CHATGPT MODEL INTEGRATION

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

          Generate a topical SEO-optimized scientific neuroscience, evolutionary biology blog article about:
  
          'Ayahuasca' 

          with the following details.

          One title, one intro paragraph. 5 minimum, 8 maximum paragraphs of content. 
          
          You can group with coherence the content of two paragraphs and create a subtitle accordingly to this paragraphs. Maximum 3 subtitles.
          
          Ensure that the images are empty strings, and the 6 keywords maximum should be related to achieving the best SEO possible, in coherence with the content of the text and the title of the article.

          Add the latest (2023 if possible) quotes, experts on the field, scientifical and trustworthy research and experiments, facts and sources. 
          
          Use technical, medical, physics and biological scientifical language with details and without restriction. 

          Return the response in a json object with the following details. Avoid any extraneous formatting or fields.
          
          Verify al the ',' and brackets ']' are in fact in the json response so it doenst return an error.
          
          The JSON structure should be compact, without unnecessary line breaks or formatting elements like 'type' or 'value' fields. 
          
          The structure should be:
          
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
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      });
      console.log('OpenAI API Response:', completion);
      console.log(JSON.stringify(completion, null, 2));


      console.log(completion.choices[0].message.content);

      const jsonResponse = completion.choices[0].message.content;

      // const jsonResponse = JSON.parse(response.choices[0].text);
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






////////////////////////////////////  ROUTES /////////////////////////////////////////////

app.use('/users', usersRoutes );


app.get('/api/data', async (req, res) => {
  try{
    const data = await articleObj.find();

  }catch{

  }
})

app.post('/insert', async (req, res) => {
  try {

    console.log('Incoming Request Data:', req.body);
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