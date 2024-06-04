import express, { Express, Request, Response } from "express";

const app: Express = express();

import cors from "cors";
app.use(cors());

import bodyParser from "body-parser";
app.use(bodyParser.json());

// Serve frontend
app.use(express.static('frontend/dist'));

import {getLlmModels, getLlmOutput} from "./llm";
import {Generation} from "../common/types/generation";

let queue = [] as Generation[];

/*
 * Start generating a new response.
 *
 * Returns the queue id for the user, that can be later used to query the status of generation.
 */
app.post('/api/start-generation', async function (req: Request, res: Response) {

  // Send the id for the queue

  let generationId = queue.length;
  res.json({ generationId });

  // Start processing the queue

  queue.push({
    done: false,
    output: ''
  });

  // Split the prompt in sentences
  let newLines = req.body.prompt.split("\n") as string[];

  // Remove empty lines
  newLines = newLines.filter(line => {
    return line.trim().length > 0;
  });

  const segmenter = new Intl.Segmenter('en-US', { granularity: 'sentence'});

  // Get sentences from each paragraph
  for (const item of newLines) {

    // https://www.reddit.com/r/learnjavascript/comments/135ljur/how_do_i_split_the_a_text_into_sentence_and/
    let sentences = [...segmenter.segment(item)].map(({ segment }) => segment) as string[];

    // Trim & remove empty lines
    sentences = sentences.filter(line => {
      return line.trim().length > 0;
    }).map(line => {
      return line.trim();
    });

    // Parse the sentences in chunks
    let sentenceChunkSize = parseInt(process.env.SENTENCES_IN_PROMPT || '0');
    let chunk = [] as string[];

    let chunkOutput = [] as string[];

    for (let i = 0; i < sentences.length; i += sentenceChunkSize) {
      chunk = sentences.slice(i, i + sentenceChunkSize);

      // Get LLM output
      let llmOutput = await getLlmOutput(chunk.join(" "), req.body.model, req.body.type);

      // Append to output
      chunkOutput.push(llmOutput.trim());

    }

    // Append to final and add newlines
    queue[generationId].output += chunkOutput.join(" ") + "\n\n";

  }

  // At this point we should be done with generation
  queue[generationId].output = queue[generationId].output.trim();
  queue[generationId].done = true;

});

/*
 * Query the status and output of queue item.
 */
app.get('/api/get-generation/:generationId', async function (req: Request, res: Response) {

  let generationId = parseInt(req.params.generationId);

  if(queue[generationId]) {
    res.json(queue[generationId]);
  } else {
    res.status(404).send('not found');
  }

});

/*
 * Get the list of available models
 */
app.get('/api/models', async function (req: Request, res: Response) {

  res.json(await getLlmModels());

});

/*
 * Start backend server
 */
app.listen(process.env.PORT, () => {
  console.log('Web server listening on port', process.env.PORT);
});

