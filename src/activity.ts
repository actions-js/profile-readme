import { Widget } from "./widget";
import { capitalize } from "./helpers";

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
  }
};

export function activity(events: any, widget: Widget<ActivityConfig>): string {
  console.log(events);
  const content = events.data
    // Filter out any boring activity
    .filter(event => serializers.hasOwnProperty(event.type))
    // We only have five lines to work with
    .slice(0, widget.config.rows ?? 5)
    // Call the serializer to construct a string
    .map(item => serializers[item.type](item))
    // Join items to one string
    .join("\n");
  return content;
}
