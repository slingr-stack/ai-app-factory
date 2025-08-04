# AI-Powered Full-Stack Code Generator

This Node.js script generates an entire project (frontend, backend, or both) based on a flexible prompt system powered by **OpenAI**. The generation is fully driven by a customizable **system prompt** and a set of **answers**, allowing you to scaffold applications with different stacks and features.


## How It Works

You define:
- A **system prompt** that instructs the model on how to behave (e.g., "You are a senior full-stack developer...")
- An **answers object** that describes what you want to build (e.g., "React + Fastify CRUD app for contacts")

The script sends these to the OpenAI API and receives the full source code for the application — file by file — and writes them to disk.

## Example stack 

You can use the script to generate projects with stacks like:

- **Frontend**: React + TypeScript + Vite + Bootstrap
- **Backend**: Fastify + MikroORM + SQLite (in-memory)
- **Validation**: Class-validator decorators
- **UI**: Form with field validation + Table listing
- **State Management**: React hooks and local state

## Requirements

- Node.js v18+
- OpenAI API key (GPT-4 recommended)


## Setup & usage

### 1. Install dependencies

```bash
npm install
```

### 2. Set your OpenAI API key

```bash
export OPENAI_API_KEY=your-openai-api-key
```

### 3. Configure the script

Open index.ts and update the `SYSTEM_PROMPT` and `answers` variables to describe your desired project.

### 4. Run the generator script

```bash
npx ts-node index.ts
```

The script will:
- Send your prompt and answers to OpenAI
- Receive the generated files (as JSON)
- Write them to the specified directory (under  ~/code-generator/projects)
- Output install and run commands

### 5. Install and run your generated project
Go to your generated project folder. For example for a TypeScript project:

```bash
cd ~/projects/contact-manager
npm install
npm run dev
```
