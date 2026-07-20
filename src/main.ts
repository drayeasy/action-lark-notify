import * as core from "@actions/core";
import { notify } from "./utils";

export async function run() {
  try {
    await notify();
    core.info("Notify succeeded.");
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(`Notify failed. Error message: ${error.message}`);
    }
  }
}
