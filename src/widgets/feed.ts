import { capitalize, pickRandomItems } from "../helpers";
import Parser, { Item } from "rss-parser";
import { Widget } from "../widget";
import { URL } from "url";
export interface FeedConfig {
  rows: number;
  raw: boolean;
  select: string | string[];
  shuffle: boolean;
}

interface Subscribe {
  [key: string]:
    | string
    | {
        [key: string]: string;
      };
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
    return `${emoji} ${index}. [${title}](${link.href})     ([${link.hostname}](${link.origin}))`;
  } else {
    return `| ${emoji} | ${index} | [${title}](${link.href})  | [${link.hostname}](${link.origin}) |`;
  }
}

const selectFeed = (select: string, subscribe: Subscribe): [string, string] => {
  const keys = select.split(":");
  const [first, second] = keys;
  if (!subscribe[first]) {
    throw new TypeError(`${first} isn't a valid key in the subscription file.`);
  }
  if (typeof subscribe[first] === "object") {
    return [[first, second].join(" "), subscribe[first][second]];
  }
  return [first, subscribe[first] as string];
};

export async function feed(subscribe: Subscribe, widget: Widget<FeedConfig>) {
  const feeds: [string, string][] = [];
  const select = widget.config.select;
  if (select) {
    if (select instanceof Array) {
      for (const item of select) {
        feeds.push(selectFeed(item, subscribe));
      }
    } else {
      feeds.push(selectFeed(select, subscribe));
    }
  } else {
    for (const [key, value] of Object.entries(subscribe)) {
      if (typeof value === "object") {
        for (const [skey, svalue] of Object.entries(value)) {
          feeds.push([[key, skey].join(" "), svalue]);
        }
      } else {
        feeds.push([key, value]);
      }
    }
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
  const contentTitle = `${pickRandomItems(["📰", "📋"], 1)[0]} ${capitalize(
    name
  )}`;

  content = `### ${contentTitle}\n > This is generated from feed provided [here](${url}). Add it to your rss reader! \n\n ${content}`;

  return content;
}
