import OpenAI from "openai";
import * as dotenv from "dotenv";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const openai = new OpenAI();
const homeDir = os.homedir();

const answers = {
  name: "contact-manager-crud-ts-t3",
  directory: homeDir.concat("/slingr/code-generator/projects/contact-manager-crud-ts-t3"),
  functionalities: "Full-stack contact manager with full CRUD using T3 Stack (Next.js, Prisma, tRPC, Tailwind, TypeScript)",
  stack: "T3 Stack (Next.js + TypeScript + Prisma + tRPC + Tailwind)",
  notes: "No authentication. Store data in SQLite via Prisma. Use tRPC for API layer.",
  type: "full stack web app",
};

const SYSTEM_PROMPT = `
You are a code generator.
Generate a complete full-stack contact manager app using the T3 Stack (Next.js, Prisma, tRPC, Tailwind, TypeScript).

Return a single JSON object with:
- files: an OBJECT mapping relative file paths to their content.
  Include Prisma schema, pages/api/trpc handler, tRPC router, DB utils, Tailwind setup, and full CRUD UI.
- install_command: the command to install dependencies
- run_command: the command to run the dev server
- run_url: the URL to open the app (e.g. http://localhost:3000)

Requirements:
- Use Next.js + TypeScript.
- Use Prisma for data layer, using SQLite.
- Use Tailwind CSS for styling.
- Use tRPC for client-server communication.
- Build CRUD UI for managing contacts (name, email, phone).
- No authentication needed.
- Use functional React components and hooks.
- Provide a single working page (index.tsx) with contact list and form.
- Format code clearly and include brief comments.
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

  // Check if directory exists
  if (fs.existsSync(answers.directory)) {
    console.warn(`⚠️ Directory already exists: ${answers.directory}`);
    console.warn(`Use --force flag if you want to overwrite it.`);
    return;
  }

  // Call OpenAI
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
