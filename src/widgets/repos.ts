import { Widget } from "../widget";
import moment from "moment";

interface ReposConfig {
  raw: boolean;
  rows: number;
  sort: string;
}

const comparators = {
  stars: (a, b) => b.stargazers_count - a.stargazers_count,
  created: (a, b) => moment(a.created_at).diff(moment(b.created_at)),
  updated: (a, b) => moment(a.updated_at).diff(moment(b.updated_at)),
  pushed: (a, b) => moment(a.pushed_at).diff(moment(b.pushed_at)),
  full_name: (a, b) => a.full_name.localeCompare(b.full_name),
}

function stars(item) {
  return `${item.stargazers_count}`
}

function description(item) {
  return `${item.description}`
}

function serialize(item, max: number, raw: boolean | undefined) {
  if (raw) {
    const data = stars(item);
    const spaces = " ".repeat(max - data.length);
    return `⭐️ ${data}${spaces} 📦 ${item.full_name}`;
  } else {
    return `| 📦 | ${stars(item)} | [${item.full_name}](${item.html_url}) | ${description(item)} |`;
  }
}

export function repos(repositories: any, widget: Widget<ReposConfig>): string {
  let repos = (repositories.data as any[])
    // we don't want to reveal secrets
    .filter(item => !item.private)
    .sort(comparators[widget.config.sort ?? "stars"])
    .slice(0, widget.config.rows ?? 5);

  const max = stars(repos.sort((a, b) => stars(b).length - stars(a).length)[0]).length;

  let content = repos
    .map(item => serialize(item, max, widget.config.raw))
    .join("\n");

  // add table headers
  if (!widget.config.raw) {
    content = "|*|Stars|Repo|Description|\n|---|---|---|---|\n" + content;
  }

  return content;
}
