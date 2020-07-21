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

function serialize(item, raw: boolean | undefined) {
  if (raw) {
    return `📦 ${item.full_name}: ⭐️ ${item.stargazers_count}`;
  } else {
    return `* 📦 [${item.full_name}](${item.url}): ⭐️ ${item.stargazers_count}`;
  }
}

export function repos(repositories: any, widget: Widget<ReposConfig>): string {
  const content = (repositories.data as any[])
    // we don't want to reveal secrets
    .filter(item => !item.private)
    .sort(comparators[widget.config.sort ?? "stars"])
    .slice(0, widget.config.rows ?? 5)
    .map(item => serialize(item, widget.config.raw))
    .join("\n");
  return content;
}
