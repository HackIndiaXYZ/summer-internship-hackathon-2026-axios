import { Octokit } from "@octokit/rest";

// Using the provided PAT or fallback to nothing.
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      // Remove trailing .git if present
      const repo = match[2].replace(/\.git$/, "");
      return { owner: match[1], repo };
    }
    return null;
  } catch {
    return null;
  }
}

const ALLOWED_EXTENSIONS = [".js", ".ts", ".jsx", ".tsx", ".py", ".env", ".json"];
const IGNORED_DIRECTORIES = ["node_modules", "dist", ".git", "build", "public"];

export async function fetchRepoContents(owner: string, repo: string): Promise<{ path: string; content: string }[]> {
  const files: { path: string; content: string }[] = [];

  // Recursive fetch max depth to prevent exceeding 10s Vercel limit
  async function fetchDir(path: string = "", depth: number = 0) {
    if (depth > 4) return; // Limit depth
    if (files.length > 20) return; // Limit total files for MVP / Hacker speed

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      const items = Array.isArray(response.data) ? response.data : [response.data];

      for (const item of items) {
        if (files.length > 20) break;

        if (item.type === "dir" && !IGNORED_DIRECTORIES.includes(item.name)) {
          await fetchDir(item.path, depth + 1);
        } else if (item.type === "file") {
          const ext = item.name.substring(item.name.lastIndexOf("."));
          // Include .env specifically even though it might not have standard ext format
          const isEnv = item.name === ".env" || item.name.startsWith(".env.");
          
          if ((ALLOWED_EXTENSIONS.includes(ext) || isEnv) && item.size < 50000) { // skip large files (>50KB)
            try {
              const fileContent = await octokit.repos.getContent({
                owner,
                repo,
                path: item.path,
              });

              if (!Array.isArray(fileContent.data) && fileContent.data.type === "file" && fileContent.data.content) {
                const content = Buffer.from(fileContent.data.content, "base64").toString("utf-8");
                files.push({ path: item.path, content });
              }
            } catch (e) {
              console.warn(`Failed to fetch content for ${item.path}`, e);
            }
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch dir ${path}`, e);
    }
  }

  await fetchDir();
  return files;
}
