# GitHub Action for Profile Readme

The GitHub Actions for adding simple widgets to your profile readme.

## Usage

### Example Workflow file

An example workflow to authenticate with GitHub Platform:

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
        with:
          persist-credentials: false
          fetch-depth: 0
      - name: Create README.md
        uses: actions-js/profile-readme@master
        with:
          username: <your username>
          github_token: ${{ secrets.GITHUB_TOKEN }}
      - name: Commit & Push changes
        uses: actions-js/push@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Example TEMPLATE.md file

```markdown
## my cool name

### 🗣 My activity:

<!--GITHUB_ACTIVITY:{"rows": 5}-->

---

<p align="center">
  Last refresh: 
  <b><!--TIMESTAMP--></b>
</p>
```

### Widgets

All widgets are identified by and HTML commend containing only a name and
optionally a JSON configuration, appended after the name, separated by a `:`.
JSON configuration are always optional.

#### GitHub Activity

Display your most recent GitHub activity

```markdown
<!--GITHUB_ACTIVITY:{"rows": 5, "raw": true}-->
```

displays as:

```
💪 Opened PR #43 in webview/webview_deno
❗️ Closed issue #32 in denosaurs/denon
🗣 Commented on #6 in nestdotland/hatcher
❗️ Closed issue #22 in nestdotland/eggs
🗣 Commented on #15 in nestdotland/eggs
```

##### Configuration

| option  | value    | default | description                                                                                        |
| ------- | -------- | ------- | -------------------------------------------------------------------------------------------------- |
| rows    | string   | `10`    | Maximum number of rows to generate.                                                                |
| raw     | boolean  | `false` | Strip markdown formatting.                                                                         |
| include | string[] | all     | Select which of the [supported events](#supported-events) you want to **include** in the showcase. |
| exclude | string[] | `[]`    | Select which of the [supported events](#supported-events) you want to **exclude** in the showcase. |

##### Supported events

```typescript
"IssueCommentEvent",
  "IssuesEvent",
  "PullRequestEvent",
  "ForkEvent",
  "ReleaseEvent",
  "PushEvent";
```

#### GitHub Repos

Display your most recent GitHub activity

```markdown
<!--GITHUB_REPOS:{"rows": 4, "raw": true}-->
```

displays as:

```
📦 webview/webview_deno: ⭐️ 439
📦 denosaurs/denon: ⭐️ 415
📦 nestdotland/eggs: ⭐️ 8
📦 nestdotland/hatcher: ⭐️ 2
```

##### Configuration

| option | value   | default   | description                                                                |
| ------ | ------- | --------- | -------------------------------------------------------------------------- |
| rows   | string  | `10`      | Maximum number of rows to generate.                                        |
| sort   | string  | `"stars"` | Sort repositories by "stars", "created", "updated", "pushed", "full_name". |
| raw    | boolean | `false`   | Strip markdown formatting.                                                 |

#### Current Timestamp

Display your most recent GitHub activity

```markdown
<!--TIMESTAMP:{"format": "dddd, MMMM Do YYYY, h:mm:ss"}-->
```

displays as:

```
Tuesday, July 21st 2020, 8:52:54 am UTC
```

##### Configuration

| option | value   | default  | description                                                               |
| ------ | ------- | -------- | ------------------------------------------------------------------------- |
| format | string  | ISO 8601 | moment [format](https://momentjs.com/docs/#/displaying/).                 |
| tz     | boolean | UTC      | moment [timezone](https://momentjs.com/timezone/docs/#/using-timezones/). |

#### Feed

Display items from web feeds such as rss or atom.

```markdown
<!--FEED:{"rows": 5, "select": "hackernews show", shuffle: true, "title": true  }-->

<!--FEED:{"rows": 5, "select": ["hackernews ask", "hackernews show"], "raw": true, "title": true }-->
```

displays as:

### 📰 Hackernews Show

> This is generated from feed provided [here](https://hnrss.org/show). Add it to your rss reader!

---

| Index | Posts                                                                                                        | Domain                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1     | [Show HN: Johariapp – For individuals to track their performance on Johari Window](https://johariapp.com/)   | [johariapp.com](https://johariapp.com)                 |
| 2     | [Show HN: Create and Monetize your Zoom Events in under 2 Minutes](http://ditto.video/)                      | [ditto.video](http://ditto.video)                      |
| 3     | [Show HN: Compare various PDF-to-text libraries in a few clicks](https://www.apibatchtest.com/)              | [www.apibatchtest.com](https://www.apibatchtest.com)   |
| 4     | [Show HN: UDT Courseware – Train people how to label a dataset](https://universaldatatool.com/courses)       | [universaldatatool.com](https://universaldatatool.com) |
| 5     | [Show HN: An OpenStreetMap Gutenberg Block for WordPress](https://wordpress.org/plugins/ootb-openstreetmap/) | [wordpress.org](https://wordpress.org)                 |

### 📋 Hackernews Ask

> This is generated from feed provided [here](https://hnrss.org/show). Add it to your rss reader!

---

1.  [Show HN: Johariapp – For individuals to track their performance on Johari Window](https://johariapp.com/) ([johariapp.com](https://johariapp.com))

2.  [Show HN: Create and Monetize your Zoom Events in under 2 Minutes](http://ditto.video/) ([ditto.video](http://ditto.video))

3.  [Show HN: Compare various PDF-to-text libraries in a few clicks](https://www.apibatchtest.com/) ([www.apibatchtest.com](https://www.apibatchtest.com))
4.  [Show HN: UDT Courseware – Train people how to label a dataset](https://universaldatatool.com/courses) ([universaldatatool.com](https://universaldatatool.com))

5.  [Show HN: An OpenStreetMap Gutenberg Block for WordPress](https://wordpress.org/plugins/ootb-openstreetmap/) ([wordpress.org](https://wordpress.org))

##### Configuration

| option  | value    | default | description                                                  |
| ------- | -------- | ------- | ------------------------------------------------------------ |
| rows    | number   | `5`     | Number of items to display                                   |
| raw     | boolean  | `false` | Strip table markdown                                         |
| shuffle | boolean  | `false` | Shuffle the items from the feed                              |
| title   | boolean  | `false` | Controls whether to add a title automatically from the feed. |
| select  | string[] | `all[]` | Select specific feeds to display.                            |

Here's what `FEEDS.json` looks like.

```json
{
  "hackernews top": "https://hnrss.org/frontpage",
  "hackernews show": "https://hnrss.org/show",
  "hackernews ask": "https://hnrss.org/show"
}
```

### Inputs

| name         | value  | default         | description                                                               |
| ------------ | ------ | --------------- | ------------------------------------------------------------------------- |
| github_token | string |                 | Token for the repo. Can be passed in using `${{ secrets.GITHUB_TOKEN }}`. |
| username     | string |                 | Github profile username.                                                  |
| feed         | string | "FEEDS.json"    | FEEDS.json file                                                           |
| template     | string | './TEMPLATE.md' | TEMPLATE.md file path.                                                    |
| readme       | string | './README.md'   | README.md output file path.                                               |
|              |

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
