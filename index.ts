import OpenAI from "openai";
import * as dotenv from "dotenv";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const openai = new OpenAI();
const homeDir = os.homedir();

const answers = {
  name: "contact-manager-ts-refine-federated-graphql",
  directory: homeDir.concat("/slingr/code-generator/projects/contact-manager-ts-refine-federated-graphql"),
  functionalities: "Full-stack admin app showing contacts from a DB (CRUD) and companies from an external REST API (read-only) under a unified GraphQL API.",
  stack: "Fastify + GraphQL + MikroORM + REST API + Refine + React + TypeScript",
  notes: `
Expose both contacts and companies in the same GraphQL schema.
Contacts use MikroORM and support full CRUD.
Companies are fetched from a REST API and are read-only.
They should be displayed in the same frontend app.
Both contacts and companies should be accessed via a shared data access interface (e.g., a common repository or service abstraction).
This shared interface should be used by GraphQL resolvers to decouple the data source from the API logic.
Support filtering contacts and companies via GraphQL queries.
Filtering should be applied server-side, leveraging MikroORM for DB and parameters for REST.
Frontend must support filtering UI and pass it through Apollo queries.
`,
  type: "full stack web app",
};

const SYSTEM_PROMPT = `
You are a code generator.
Generate a complete full-stack admin app with a unified GraphQL API that federates access to multiple data sources.

Backend:
- Use Fastify as the HTTP server.
- Use MikroORM for the database layer. Retrieve and manage 'contacts' from a local database (SQLite or PostgreSQL).
- Retrieve 'companies' from an external REST API (mocked or configurable base URL).
- Define a GraphQL schema that exposes both contacts (with full CRUD) and companies (read-only).
- Allow filtering of contacts and companies using GraphQL queries. Apply filters in the backend (MikroORM filters for contacts; REST query params or manual filter logic for companies).
- Ensure both contacts and companies are accessed using a shared data access interface (e.g., a common service or repository pattern).
- Implement type-safe resolvers that rely on this shared interface to fetch data from either MikroORM or REST.
- Use SDL or a code-first approach (e.g. with graphql-tools or Nexus).
- Ensure GraphQL is the only access layer for both sources.

Frontend:
- Use Refine (React + TypeScript) as the admin UI framework.
- Use Apollo Client to connect to the backend GraphQL API.
- Display and manage contacts (CRUD: list, create, update, delete).
- Display companies in a read-only list view.
- Allow filtering of contacts and companies using Refine UI components, passing filters through GraphQL queries.
- Use a tabbed interface or separate routes to navigate between contacts and companies.
- UI must be clean, minimal, responsive, and fully typed with TypeScript.

Output:
Return a single JSON object with:
- files: an object mapping relative file paths to their content.
  Include backend and frontend code, configs, GraphQL schema, resolvers, entities, services, shared interfaces, and mock API if needed.
- install_command: the command to install dependencies for backend and frontend.
- run_command: the command to run both backend and frontend (or concurrently).
- run_url: the URL where the frontend app can be accessed (e.g. http://localhost:3000).

All code must be clean, modular, and well-commented. Use .env for configs where appropriate.
Separate frontend and backend in /frontend and /backend folders.
`;

const userPrompt = `
Project: ${answers.name}
Directory: ${answers.directory}
Functionalities: ${answers.functionalities}
Stack: ${answers.stack}
Notes: ${answers.notes}
Type: ${answers.type}
`;

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const promptDir = path.resolve("prompts");
  if (!fs.existsSync(promptDir)) {
    fs.mkdirSync(promptDir, { recursive: true });
  }
  const promptFilePath = path.join(promptDir, `${answers.name}-${timestamp}.txt`);
  const promptContent = `SYSTEM PROMPT:\n${SYSTEM_PROMPT}\n\nUSER PROMPT:\n${userPrompt}\n`;
  fs.writeFileSync(promptFilePath, promptContent, "utf-8");
  console.log(`📝 Saved prompts to ${promptFilePath}`);

  if (fs.existsSync(answers.directory)) {
    console.warn(`⚠️ Directory already exists: ${answers.directory}`);
    console.warn(`Use --force flag if you want to overwrite it.`);
    return;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }

  let result;
  try {
    result = JSON.parse(content);
  } catch (err) {
    console.error("❌ Failed to parse OpenAI response.");
    console.error(content);
    throw err;
  }

  for (const [filename, fileData] of Object.entries(result.files)) {
    const filePath = path.join(answers.directory, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    let fileContent: string;

    const raw = typeof fileData === "object" && "content" in fileData ? fileData.content : fileData;

    if (typeof raw === "object") {
      fileContent = JSON.stringify(raw, null, 2);
    } else if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        fileContent = JSON.stringify(parsed, null, 2);
      } catch {
        fileContent = raw;
      }
    } else {
      fileContent = String(raw);
    }

    fs.writeFileSync(filePath, fileContent, "utf-8");
    console.log(`✅ Wrote ${filePath}`);
  }

  console.log("\n🎉 All files saved to:", answers.directory);
  console.log("📦 Install command:", result.install_command);
  console.log("🚀 Run command:", result.run_command);
  console.log("🌐 Run URL:", result.run_url);
}

main().catch(console.error);
