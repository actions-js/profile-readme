import { Widget } from "../widget";
import { capitalize } from "../helpers";

interface ActivityConfig {
  rows: number;
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
    return `🍴 Forked ${item.forkee.full_name} from ${item.repo.name}`;
  },
  ReleaseEvent: item => {
    return `📦 Released "${item.payload.release.name}" in ${item.repo.name}`;
  }
};

export function activity(events: any, widget: Widget<ActivityConfig>): string {
  const content = events.data
    .filter(event => serializers.hasOwnProperty(event.type))
    .slice(0, widget.config.rows ?? 5)
    .map(item => serializers[item.type](item))
    .join("\n");
  return content;
}
