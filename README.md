# Lark Notify - GitHub Action

![Version](./badge.svg)

A [GitHub Action](https://github.com/features/actions) to send a message to a Lark group.

## Usage

You can use this action after any other action. Here is an example setup of this action:

1. Create a `.github/workflows/lark-notify.yml` file in your GitHub repo.
2. Add the following code to the `lark-notify.yml` file.

```yaml
on: push
name: Lark Notification Demo
jobs:
  larkNotification:
    name: Lark Notification
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Lark Notification
        uses: drayeasy/action-lark-notify@main
        env:
          LARK_WEBHOOK: ${{ secrets.LARK_WEBHOOK }}
```

3. Create `LARK_WEBHOOK` secret using [GitHub Action's Secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository). You can [generate a Lark bot webhook](https://open.larksuite.com/document/client-docs/bot-v3/add-custom-bot#da10d830).

## Environment Variables

By default, action is designed to run with minimal configuration but you can alter Lark notification using following environment variables:

| Variable                    | Default            | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LARK_WEBHOOK                | -                  | **Required.** Lark bot webhook url.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| LARK_SECRET                 | -                  | **Required if you enable signature verification.** Lark bot secret.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| LARK_MESSAGE_TITLE          | `$GITHUB_WORKFLOW` | The title of the message card header. See [Card header](https://open.larksuite.com/document/common-capabilities/message-card/message-cards-content/card-header) for more information. <br /> `$GITHUB_WORKFLOW` is a GitHub action [default environment variable](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables).                                                                                 |
| LARK_MESSAGE_SUBTITLE       | -                  | The subtitle of the message card header. See [Card header](https://open.larksuite.com/document/common-capabilities/message-card/message-cards-content/card-header) for more information.                                                                                                                                                                                                                                                                                                        |
| LARK_MESSAGE_ICON_IMG_KEY   | -                  | The icon image key of the message card header. See [Card header](https://open.larksuite.com/document/common-capabilities/message-card/message-cards-content/card-header) for more information.                                                                                                                                                                                                                                                                                                  |
| LARK_MESSAGE_TEMPLATE       | `"green"`          | The template of the message card header. See [Title style sheet](https://open.larksuite.com/document/common-capabilities/message-card/message-cards-content/card-header#ec1be977) for more information.                                                                                                                                                                                                                                                                                         |
| LARK_MESSAGE_AUTHOR         | `$GITHUB_ACTOR`    | The name of the person or app that initiated the workflow. See [Default environment variables](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables) for more information. <br /> `$GITHUB_ACTOR` is a GitHub action [default environment variable](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables). |
| LARK_MESSAGE_ENABLE_FORWARD | -                  | Whether forwarding of cards is allowed. See [Configure card properties](https://open.larksuite.com/document/common-capabilities/message-card/getting-started/card-structure/card-configuration) for more information.                                                                                                                                                                                                                                                                           |
| LARK_MESSAGE_UPDATE_MULTI   | -                  | Whether it is a shared card. See [Configure card properties](https://open.larksuite.com/document/common-capabilities/message-card/getting-started/card-structure/card-configuration) for more information.                                                                                                                                                                                                                                                                                      |
| LARK_MESSAGE_URL            | -                  | The URL of the message card. See [Link element](https://open.larksuite.com/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements#426fb98d) for more information.                                                                                                                                                                                                                                                                                             |
| LARK_MESSAGE_ANDROID_URL    | -                  | The Android URL of the message card. See [Link element](https://open.larksuite.com/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements#426fb98d) for more information.                                                                                                                                                                                                                                                                                     |
| LARK_MESSAGE_IOS_URL        | -                  | The iOS URL of the message card. See [Link element](https://open.larksuite.com/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements#426fb98d) for more information.                                                                                                                                                                                                                                                                                         |
| LARK_MESSAGE_PC_URL         | -                  | The PC URL of the message card. See [Link element](https://open.larksuite.com/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements#426fb98d) for more information.                                                                                                                                                                                                                                                                                          |

Also see [Accessing contextual information about workflow runs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs).

## Develop

1. Git clone
2. Use Node.js specified in `.node-version`
3. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
4. Run `pnpm install`
5. Set up `.env` file like below

```shell
LARK_WEBHOOK=test-webhook # Must update
LARK_SECRET=test-secret # Maybe update
GITHUB_ACTOR=test-actor
GITHUB_WORKFLOW=workflow-name
GITHUB_SERVER_URL=https://github.com
GITHUB_REPOSITORY=test-owner/test-repo
GITHUB_REF=refs/heads/main
GITHUB_EVENT_NAME=push
GITHUB_ACTION=test-action
GITHUB_RUN_ID=test-id
GITHUB_SHA=test-sha

```

6. Update code
7. Run `pnpm run local` to test
8. Run `pnpm run release` to release

## Credits

- <https://github.com/rtCamp/action-slack-notify>
- <https://github.com/wnose/chatbot-webhook-client>

## License

[MIT](LICENSE)
