## Phrasing Bot

A web interface bot to check and improve grammar and phrasing of your input, similar to Quillbot or Grammarly.

Use any backend LLM service of your choice, even locally hosted ones (check "Installation" for more)!

![image](https://github.com/Krisseck/Phrasing-Bot/assets/471887/3edbc5f4-53cf-4346-af80-655e1836acf4)


# Requirements

- node version 20.* (check `.nvmrc`)
- yarn

# Installation

- Copy `env.example` to `.env`
  - Change `REQUEST_TYPE` to one of these: `custom, groq, openrouter, openai`
  - For `groq, openrouter, openai`, make sure you fill in the env variables with corresponding prefix
  - For `custom`
    - Run your own OpenAI-compatible server (llama.cpp, llamafile, Koboldcpp etc) and make sure it is accessible
    - make sure you fill in the env variables with `CUSTOM_` prefix
    - `CUSTOM_API_BASE_URL` should usually end with `/v1`
    - `CUSTOM_API_KEY` or `CUSTOM_API_MODEL` can usually be left empty
    - For `CUSTOM_API_PROMPT_TEMPLATE`, check available types in `src/prompt-template.ts`, so like `MISTRAL`, `LLAMA_3` etc

Build frontend
`cd frontend && yarn && yarn build`

Build backend
`yarn && yarn build`

# Running

Start server
`yarn start`

The server should now be running on `http://localhost:5000/`

# Development

Bit yanky, need to run the frontend and backend separately

Run frontend `cd frontend && yarn && yarn dev`

In separate window, run backend `yarn && yarn dev`

You should now have frontend running on `http://localhost:5173/` and backend on `http://localhost:5000/` with live reloading etc.
