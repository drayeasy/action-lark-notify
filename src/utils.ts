import { createHmac } from "node:crypto";
import core from "@actions/core";
import { HttpClient } from "@actions/http-client";
import shell from "shelljs";
import type { LarkResponse, RequestSignature } from "./types";

export function toBoolean(value: string | undefined) {
  return value === "true";
}

export function getRequestUrl(): string {
  const url = process.env.LARK_WEBHOOK;
  if (!url) {
    throw new Error("LARK_WEBHOOK is required");
  }
  return url;
}

export function getRequestSignature(): RequestSignature {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const secret = process.env.LARK_SECRET;
  if (!secret) {
    core.warning(
      "LARK_SECRET is not set, sign is skipped and it may lead to signature verification failure in Lark.",
    );
    core.warning(
      "See https://open.larksuite.com/document/client-docs/bot-v3/add-custom-bot#c1491056 for more information.",
    );
    return {};
  }
  const buffer = Buffer.from(`${timestamp}\n${secret}`, "utf-8");
  const sign = createHmac("sha256", buffer)
    .update(Buffer.alloc(0))
    .digest("base64");
  return {
    timestamp,
    sign,
  };
}

export function getCardHeader() {
  return {
    title: {
      tag: "plain_text",
      content: process.env.LARK_MESSAGE_TITLE || process.env.GITHUB_WORKFLOW,
    },
    subtitle: {
      tag: "plain_text",
      content: process.env.LARK_MESSAGE_SUBTITLE,
    },
    icon: {
      img_key: process.env.LARK_MESSAGE_ICON_IMG_KEY,
    },
    template: process.env.LARK_MESSAGE_TEMPLATE || "green",
  };
}

export function getCardElements() {
  const result = shell.exec("git log -1 --pretty=%B", { silent: true });
  if (result.code !== 0) {
    core.setFailed(
      `Cannot get Git information. Have you setup the action correctly? ${
        result.stderr ?? result.stdout
      }`,
    );
  }
  const lastGitMessage = result.stdout.trim();

  return [
    {
      tag: "column_set",
      flex_mode: "bisect",
      background_style: "default",
      horizontal_spacing: "default",
      columns: [
        {
          tag: "column",
          width: "weighted",
          weight: 1,
          elements: [
            {
              tag: "markdown",
              content: `**Repo**\n[${process.env.GITHUB_REPOSITORY}](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY})`,
            },
          ],
        },
        {
          tag: "column",
          width: "weighted",
          weight: 1,
          elements: [
            {
              tag: "markdown",
              content: `**Actor**\n${
                process.env.LARK_MESSAGE_AUTHOR || process.env.GITHUB_ACTOR
              }`,
            },
          ],
        },
      ],
    },
    {
      tag: "column_set",
      flex_mode: "bisect",
      background_style: "default",
      horizontal_spacing: "default",
      columns: [
        {
          tag: "column",
          width: "weighted",
          weight: 1,
          elements: [
            {
              tag: "markdown",
              content: `**Ref**\n${process.env.GITHUB_REF}`,
            },
          ],
        },
        {
          tag: "column",
          width: "weighted",
          weight: 1,
          elements: [
            {
              tag: "markdown",
              content: `**Event**\n${process.env.GITHUB_EVENT_NAME}`,
            },
          ],
        },
      ],
    },
    {
      tag: "column_set",
      flex_mode: "bisect",
      background_style: "default",
      horizontal_spacing: "default",
      columns: [
        {
          tag: "column",
          width: "weighted",
          weight: 1,
          elements: [
            {
              tag: "markdown",
              content: `**Action**\n[${process.env.GITHUB_ACTION}](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID})`,
            },
          ],
        },
        {
          tag: "column",
          width: "weighted",
          weight: 1,
          elements: [
            {
              tag: "markdown",
              content: `**Commit**\n${process.env.GITHUB_SHA}`,
            },
          ],
        },
      ],
    },
    {
      tag: "markdown",
      content: `**Message**\n${lastGitMessage}`,
    },
  ];
}

export function getCardConfig() {
  return {
    enable_forward: toBoolean(
      process.env.LARK_MESSAGE_ENABLE_FORWARD || "true",
    ),
    update_multi: toBoolean(process.env.LARK_MESSAGE_UPDATE_MULTI || "false"),
  };
}

export function getCardLink() {
  return {
    url: process.env.LARK_MESSAGE_URL,
    android_url: process.env.LARK_MESSAGE_ANDROID_URL,
    ios_url: process.env.LARK_MESSAGE_IOS_URL,
    pc_url: process.env.LARK_MESSAGE_PC_URL,
  };
}

export async function getRequestBody() {
  const requestSignature = getRequestSignature();
  const header = getCardHeader();
  const elements = getCardElements();
  const config = getCardConfig();
  const link = getCardLink();

  return {
    ...requestSignature,
    msg_type: "interactive",
    card: {
      header,
      elements,
      config,
      card_link: link,
    },
  };
}

export async function notify() {
  const httpClient = new HttpClient();
  const requestUrl = getRequestUrl();
  core.debug(`Request URL: ${requestUrl}`);
  const requestBody = await getRequestBody();
  core.debug(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);
  console.log("requestBody", JSON.stringify(requestBody, null, 2));

  return httpClient
    .postJson<LarkResponse>(requestUrl, requestBody)
    .then((response) => {
      core.debug(`Server Response: ${JSON.stringify(response, null, 2)}`);
      console.log("response", JSON.stringify(response, null, 2));
      const { statusCode, result } = response;
      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(`Server status code ${statusCode} is out of range`);
      }
      if (!result) {
        throw new Error("Server response is empty");
      }
      if (result.code !== 0) {
        throw new Error(
          `Server response code: ${result.code}, message: ${result.msg}`,
        );
      }
      return response;
    });
}