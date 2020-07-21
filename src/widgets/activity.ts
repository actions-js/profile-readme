import { Widget } from "../widget";
import { capitalize } from "../helpers";

interface ActivityConfig {
  raw: boolean;
  rows: number;
  exclude: string[];
  include: string[];
}

const serializers = {
  IssueCommentEvent: item => {
    return `🗣 Commented on #${item.payload.issue.number} in ${item.repo.name}`;
  },
  IssuesEvent: item => {
    return `❗️ ${capitalize(item.payload.action)} issue #${
      item.payload.issue.number
    } in ${item.repo.name}`;
  },
  PullRequestEvent: item => {
    const emoji = item.payload.action === "opened" ? "💪" : "❌";
    const line = item.payload.pull_request.merged
      ? "🎉 Merged"
      : `${emoji} ${capitalize(item.payload.action)}`;
    return `${line} PR #${item.payload.pull_request.number} in ${item.repo.name}`;
  },
  ForkEvent: item => {
    return `🍴 Forked ${item.payload.forkee.full_name} from ${item.repo.name}`;
  },
  ReleaseEvent: item => {
    return `📦 Released "${item.payload.release.name}" in ${item.repo.name}`;
  },
  PushEvent: item => {
    const commits = item.payload.size > 1
      ? `${item.payload.size} commits`
      : `${item.payload.size} commit`
    return `⬆️ Pushed ${commits} to ${item.repo.name}`;
  }
};

function serialize(item, raw: boolean | undefined): string {
  const res = serializers[item.type](item);
  if (raw) return res;
  return `* ${res}`;
}

export function activity(events: any, widget: Widget<ActivityConfig>): string {
  const supportedTypes = Object.keys(serializers);
  const include = widget.config.include ?? supportedTypes;
  const exclude = widget.config.exclude ?? [];

  const content = (events.data as any[])
    .filter(event => serializers.hasOwnProperty(event.type))
    .filter(event => include.includes(event.type))
    .filter(event => !exclude.includes(event.type))
    .slice(0, widget.config.rows ?? 10)
    .map(item => serialize(item, widget.config.raw))
    .join("\n");
  return content;
}
