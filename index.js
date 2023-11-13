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
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const runPrompt = async() =>{

          const prompt = `

          Generate an SEO-optimized neuroscience article with the following details.

          One title, one intro paragraph. 5 minimum, 8 maximum paragraphs of content. 
          
          You can group with coherence the content of two paragraphs and create a subtitle accordingly to this paragraphs. Maximum 3 subtitles.
          
          Ensure that the properties for images are empty strings, and the 6 keywords maximum should be related to achieving the best SEO possible, in coherence with the content of the text and the title of the article.
          
          Format your response using the following JSON structure, no extra text, no "\n".
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
  
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2048,
    temperature: 1.2,
  });
  
  // console.log(response.choices[0].text);
  
  const resultText = response.choices[0].text;

  const multipliedBy= resultText * 10; //for the oment we gonna keep ot 10 wemight assign a variable later to this project
  


  console.log(`Result multiplied by 10: ${multipliedBy}`);
         

}

runPrompt();




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




app.get('/insert', async (req,res)=>{
   try {
  const newArticleData = {
      title: "Neuroscience",
      subtitle: "teh wonders of the brain",
      intro: "I really like to blog about the sciences of the mind",
      paragraphs: [ "I cant live without blogging about this dear and close to my heart passion called neuroscience", 
    "exploring the realms of neuroscience, biohacking and evolutionary biology have been theme in my everyday curiosity"],
    keywords: [ "neuroscience", "mind", "thinking"],
    }

  const savedArticle = await articleObj.create(newArticleData);
  res.json(savedArticle);

   } catch (error) {
      console.error('error inserting article', error);
      res.status(500).json({error: 'Internal Server Error'});
   }
});

app.use('/', (req, res) => { res.send('Hello world!'); }); 



app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));