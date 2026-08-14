const GITHUB_USERNAME = "rkhplace";
// Over-fetch, because filtering out the profile repo and undocumented repos
// below can easily drop the pool under 6 if we only ask for 6 to begin with.
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

/*
 * Repos that hold the front of the list no matter when they were last pushed.
 * Ordering purely by `updated_at` means a README typo in a practice repo can
 * knock the cloud and security work off the page — and that is precisely the
 * work worth leading with, since almost every other student portfolio is
 * another CRUD app. The full pool is fetched (per_page=100, not 30) so a
 * featured repo cannot fall out of the payload just by going quiet.
 */
const FEATURED_REPOS = [
  "scalable-web-app-azure",
  "Tugas-Besar-Cyber-Security",
  "JUALIN-ABP",
];

const featureRank = (repo) => {
  const name = cleanText(repo.name).toLowerCase();
  const index = FEATURED_REPOS.findIndex((entry) => entry.toLowerCase() === name);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const isFeatured = (repo) => featureRank(repo) !== Number.MAX_SAFE_INTEGER;

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

// A repo named after the account is the special GitHub profile-README repo,
// not a project — it has no description and shouldn't be featured as one.
const isProfileRepo = (repo) => cleanText(repo.name).toLowerCase() === GITHUB_USERNAME.toLowerCase();

const normalizeRepo = (repo) => {
  const language = cleanText(repo.language);
  const topics = Array.isArray(repo.topics) ? repo.topics.map(cleanText).filter(Boolean) : [];
  const stack = [...new Set([language, ...topics].filter(Boolean))];
  const homepage = cleanText(repo.homepage);

  return {
    id: String(repo.id || repo.name),
    title: cleanText(repo.name) || "GitHub Repository",
    type: language || "GitHub Repository",
    description: cleanText(repo.description),
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
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          !isProfileRepo(repo) &&
          // Featured repos are chosen deliberately, so they are exempt from the
          // description requirement the rest of the pool has to clear — the
          // client supplies a fallback blurb for anything that arrives empty.
          (isFeatured(repo) || cleanText(repo.description)),
      )
      .sort((a, b) => {
        const byFeature = featureRank(a) - featureRank(b);
        if (byFeature !== 0) return byFeature;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
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
