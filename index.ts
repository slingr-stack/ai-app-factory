import OpenAI from "openai";
import * as dotenv from "dotenv";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const openai = new OpenAI();
const homeDir = os.homedir();

const answers = {
  name: "contact-manager-crud-ts-react-bootstrap",
  directory: homeDir.concat("/slingr/code-generator/projects/contact-manager-crud-ts-react-bootstrap"),
  functionalities: "Full CRUD for contacts (name, email, phone) with React and TypeScript",
  stack: "React + TypeScript + Vite + Bootstrap",
  notes: "Functional components, hooks, and local state only. No backend.",
  type: "web app",
};

const SYSTEM_PROMPT = `
You are a code generator.
Generate a complete end-to-end CRUD React app using TypeScript.
Return a single JSON object with:
- files: an OBJECT mapping relative file paths to their content.
  Include package.json, tsconfig.json, vite.config.ts, src/main.tsx, src/App.tsx, src/components/, and public/index.html.
- install_command: the command to install dependencies
- run_command: the command to run the dev server
- run_url: the URL to open the app (e.g. http://localhost:5173)

Requirements:
- Use Vite as the build tool.
- Use React functional components with hooks (useState, useEffect).
- Manage contacts (name, email, phone) with full CRUD (Create, Read, Update, Delete).
- Use local React state for data storage (no backend required).
- Use Bootstrap 5 for styling (include Bootstrap from CDN in index.html).
- Components:
  - ContactForm.tsx for adding and editing contacts.
  - ContactList.tsx for displaying contacts.
- Clean, clear code with comments.
- Use TypeScript throughout.
- File paths must be relative and use '/'.
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
  // Save prompts to a file with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const promptDir = path.resolve("prompts");
  if (!fs.existsSync(promptDir)) {
    fs.mkdirSync(promptDir, { recursive: true });
  }
  const promptFilePath = path.join(promptDir, `${answers.name}-${timestamp}.txt`);
  const promptContent = `SYSTEM PROMPT:\n${SYSTEM_PROMPT}\n\nUSER PROMPT:\n${userPrompt}\n`;
  fs.writeFileSync(promptFilePath, promptContent, "utf-8");
  console.log(`📝 Saved prompts to ${promptFilePath}`);

  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const result = JSON.parse(response.choices[0].message.content);


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


  console.log("\nAll files saved to:", answers.directory);
  console.log("Install command:", result.install_command);
  console.log("Run command:", result.run_command);
  console.log("Run URL:", result.run_url);
}

main().catch(console.error);
