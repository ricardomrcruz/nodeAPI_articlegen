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

          Generate a 2000 word topical scientifically-focused, SEO-optimized blog article on the topic:
  
          'the brain hallucinates our conscious reality scientically explained' 

          Ensure the content aligns with Google's latest SEO standards as outlined at https://developers.google.com/search/docs/fundamentals/creating-helpful-content.

          Requirements:
            
            - Controversial and out-of-the-box title.
   
            - Intro paragraph, followed by 6-8 content paragraphs. 

            - Group related content into a maximum of 3 subtitles, labeled with numbers 1., 2., 3. Group the content paragraphs and subtitles with coherence and numbered labels. 
          
            - Include up to 6 SEO-relevant keywords, consistent with the article's content and title.
          
            - Include up to 6 SEO-relevant keywords, consistent with the article's content and title.

            - Add current (2023) quotes, experts' opinions, scientific research, facts, and sources.
          
            - Use technical language from medical, physics, and biological sciences.

          Return the response in a compact json object with the following details. Avoid any extraneous formatting or fields.
          
          Verify al the ',' and brackets ']' are in fact present, no unnecessary line breaks or formatting elements like 'type' or 'value' fields. 
          
          Format:
          
          {
            "title": "string",
            "subtitle": ["string"],
            "intro": "string",
            "paragraphs": ["string"],
            "keywords": ["string"],
            "image1": "string uri",
            "image2": "string uri",
            "required": ["_id", "title", "subtitle", "intro", "paragraphs", "keywords"]
          }
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

    // console.log('Incoming Request Data:', req.body);
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