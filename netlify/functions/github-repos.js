const GITHUB_REPOS_URL = "https://api.github.com/users/rkhplace/repos?sort=updated&per_page=6";

const fallbackDescription = "Public GitHub repository by Rakha, kept available for code review and project reference.";

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeRepo = (repo) => {
  const language = cleanText(repo.language);
  const topics = Array.isArray(repo.topics) ? repo.topics.map(cleanText).filter(Boolean) : [];
  const stack = [...new Set([language, ...topics].filter(Boolean))];
  const homepage = cleanText(repo.homepage);

  return {
    id: String(repo.id || repo.name),
    title: cleanText(repo.name) || "GitHub Repository",
    type: language || "GitHub Repository",
    description: cleanText(repo.description) || fallbackDescription,
    stack: stack.length > 0 ? stack.slice(0, 4) : ["GitHub"],
    href: repo.html_url,
    demo: homepage || "",
    updatedAt: repo.updated_at,
  };
};

export async function handler() {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
  };

  try {
    const githubHeaders = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Rakha-Portofolio",
    };

    if (process.env.GITHUB_TOKEN) {
      githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(GITHUB_REPOS_URL, { headers: githubHeaders });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "Failed to fetch GitHub repositories" }),
      };
    }

    const repos = await response.json();
    const normalizedRepos = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6)
      .map(normalizeRepo);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ repos: normalizedRepos }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "GitHub repository API unavailable" }),
    };
  }
}
