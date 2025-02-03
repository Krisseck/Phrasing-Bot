import "dotenv/config";

import OpenAI from 'openai';
import {Models} from "openai/resources";
import ModelsPage = Models.ModelsPage;

let apiBaseUrl: string | undefined;
let apiKey: string | undefined;
let model = '';

const requestType = process.env.REQUEST_TYPE?.toUpperCase() || 'OPENAI';

import {ExpandedModel} from "../common/types/llm";
import {promptTypes} from "../common/prompt-types";
import {styles} from "../common/styles";

switch(requestType) {
    case 'CUSTOM':
        apiBaseUrl = process.env.CUSTOM_API_BASE_URL;
        apiKey = process.env.CUSTOM_API_KEY;
        model = process.env.CUSTOM_API_MODEL || '';
        break;
    case 'GROQ':
        apiBaseUrl = 'https://api.groq.com/openai/v1';
        apiKey = process.env.GROQ_API_KEY;
        model = process.env.GROQ_MODEL || '';
        break;
    case 'OPENROUTER':
        apiBaseUrl = 'https://openrouter.ai/api/v1';
        apiKey = process.env.OPENROUTER_API_KEY;
        model = process.env.OPENROUTER_MODEL || '';
        break;
    case 'OPENAI':
        apiBaseUrl = 'https://api.openai.com/v1';
        apiKey = process.env.OPENAI_API_KEY;
        model = process.env.OPENAI_MODEL || '';
        break;
}

const openai = new OpenAI({
    apiKey,
    baseURL: apiBaseUrl
});

export async function getLlmOutput(input: string, model: string, promptType: string, style: string | undefined) {

    let promptContent = promptTypes[promptType].content;

    if(style) {
        promptContent = promptContent.replace("{STYLE}", styles[style].content);
    }

    promptContent = promptContent + "\n\nParagraph: " + input;

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [
            {
                role: 'system',
                content: promptTypes[promptType].system_prompt
            },
            {
                role: 'user',
                content: promptContent
            }
        ],
        model,
        temperature: 0.1
    };

    const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);

    let llmOutput = chatCompletion.choices[0].message.content || '';

    // If there is only two quotes in the output and they are at the ends, strip them out
    if((llmOutput.match(/"/g)||[]).length == 2 && llmOutput[0] === "\"" && llmOutput[llmOutput.length - 1] == "\"") {
        llmOutput = llmOutput.substring(1, llmOutput.length - 1);
    }

    return llmOutput;

}

export async function getLlmModels() {

    const modelsPage: ModelsPage = await openai.models.list();

    const models = modelsPage.data as ExpandedModel[];

    // If there is only one model available, make it default. Otherwise, check with env variable
    if(models.length == 1) {
        models[0].default = true;
    } else {
        // Check for default model set by env variable
        for (let [index] of models.entries()) {
            if (models[index].id.toUpperCase() === model.toUpperCase()) {
                models[index].default = true;
            }
        }
    }

    return models;

}
