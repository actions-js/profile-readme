import { capitalize, pickRandomItems } from "../helpers";
import Parser, { Item } from "rss-parser";
import { Widget } from "../widget";
import { URL } from "url";
export interface FeedConfig {
  rows: number;
  raw: boolean;
  select: string[];
  shuffle: boolean;
  title: boolean;
}

function serialize(
  item: Item,
  emoji: string,
  index: number,
  raw: boolean | undefined
) {
  let title = item
    .title!.split("\n")
    .join("")
    .trim();

  const link = new URL(
    item.link! || "https://www.youtube.com/watch?v=oHg5SJYRHA0"
  );

  if (raw) {
    return `${emoji} ${index}. [${title}](${link.href}) ([${link.hostname}](${link.origin})) <br/>`;
  } else {
    return `| ${emoji} | ${index} | [${title}](${link.href})  | [${link.hostname}](${link.origin}) |`;
  }
}

export async function feed(
  subscribe: { [key: string]: string },
  widget: Widget<FeedConfig>
) {
  let feeds = Object.entries(subscribe);

  if (widget.config.select) {
    feeds = feeds.filter(([name]) => widget.config.select!.includes(name));
  }

  const [name, url] = pickRandomItems(feeds, 1)[0];
  const feed = new Parser();

  let result = await feed.parseURL(url);

  if (widget.config.shuffle) {
    result.items = result
      .items!.map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  result.items = result.items!.slice(0, widget.config.rows ?? 5);

  const emojis = ["📭", "📌", "🔖"];
  const [emoji] = pickRandomItems(emojis, 1);
  let content = result.items
    .map((item, index) => serialize(item, emoji, index + 1, widget.config.raw))
    .join("\n");

  if (!widget.config.raw) {
    content = "|* |No | Posts | Domain |\n|---|---|---|---|\n" + content;
  }

  if (widget.config.title) {
    const contentTitle = `${pickRandomItems(["📰", "📋"], 1)[0]} ${capitalize(
      name
    )}`;
    content = `### ${contentTitle}\n > This is generated from feed provided [here](${url}). Add it to your rss reader! \n\n ${content}`;
  }

  return content;
}
