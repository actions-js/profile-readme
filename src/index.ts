import * as core from "@actions/core";
import * as github from "@actions/github";
import * as fs from "fs";
import { widgets } from "./widget";
import { activity } from "./activity";

async function run() {
  const token = core.getInput("github_token");
  const template = core.getInput("template");
  const username = core.getInput("username");

  const octokit = github.getOctokit(token);

  let source = fs.readFileSync(template, "utf-8");

  const activityWidgets = widgets("GITHUB_ACTIVITY", source);
  if (activityWidgets) {
    for (const widget of activityWidgets) {
      const events = await octokit.activity.listPublicEventsForUser({
        username,
        per_page: 100
      });
      core.info(JSON.stringify(events, null, 2))
      source.replace(widget.matched, activity(events, widget));
    }
  }

  fs.writeFileSync(template, source);
}

run();
