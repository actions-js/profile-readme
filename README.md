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

------------
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
<!--GITHUB_ACTIVITY:{"rows": 5}-->
```

displays as:

```
💪 Opened PR #43 in <repo>
❗️ Closed issue #645 in <repo>
🗣 Commented on #645 in <repo>
❗️ Closed issue #704 in <repo>
🗣 Commented on #93 in <repo>
```

##### Configuration

```jsonc
{
  "rows": 12 // default 5
}
```

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

```jsonc
{
  "format": "h:mm:ss" // default is ISO 8601
}
```

### Inputs

| name         | value   | default         | description |
| ------------ | ------  | --------------- | ----------- |
| github_token | string  |                 | Token for the repo. Can be passed in using `${{ secrets.GITHUB_TOKEN }}`. |
| username     | string  |                 | Github profile username. |
| template     | string  | './TEMPLATE.md' | TEMPLATE.md file path.   |
| readme       | string  | './README.md'   | README.md output file path.   |

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).