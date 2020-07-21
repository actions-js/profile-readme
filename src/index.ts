import * as core from "@actions/core";
import * as github from "@actions/github";
import * as fs from "fs";
import { widgets } from "./widget";
import { activity } from "./widgets/activity";
import { timestamp } from "./widgets/timestamp";

async function run() {
  const token = core.getInput("github_token");
  const template = core.getInput("template");
  const readme = core.getInput("readme");
  const username = core.getInput("username");

  const octokit = github.getOctokit(token);

  let source = fs.readFileSync(template, "utf-8");

  const activityWidgets = widgets("GITHUB_ACTIVITY", source);
  if (activityWidgets) {
    core.info(`Found ${activityWidgets.length} activity widget.`);
    core.info(`Collecting user ${username} activity...`);
    const events = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100
    });
    for (const widget of activityWidgets) {
      core.info(`Generating widget "${widget.matched}"`);
      source = source.replace(widget.matched, activity(events, widget));
    }
  }

  const timestampWidgets = widgets("TIMESTAMP", source);
  if (timestampWidgets) {
    core.info(`Found ${timestampWidgets.length} timestamp widget.`);
    core.info(`Collecting user ${username} activity...`);
    for (const widget of timestampWidgets) {
      core.info(`Generating widget "${widget.matched}"`);
      source = source.replace(widget.matched, timestamp(widget));
    }
  }

  fs.writeFileSync(readme, source);
}

run().catch(error => {
  core.error(error);
  process.exit(1);
});
