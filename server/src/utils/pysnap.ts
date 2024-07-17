import { PythonShell } from "python-shell";
import QueueModel from "../models/QueueModel.js";

const { PY_SCRIPT_PATH } = process.env;

export const pySnap = async () => {
  const runningItem = await QueueModel.findOne({
    where: { status: "running" },
  });
  if (runningItem) {
    console.log("Queue is Busy");
    return;
  }
  const queueItem = await QueueModel.findOne({
    where: { status: "queued" },
    order: ["updatedAt"],
  });
  if (!queueItem) {
    console.log("Queue is Empty");
    return;
  }
  const workspaceId = queueItem.get("workspace") as string;
  await queueItem.update({
    status: "running",
  });
  PythonShell.run("index.py", {
    scriptPath: PY_SCRIPT_PATH,
    args: [workspaceId],
    
  })
    .then((results) => {
      console.log("pySnap Success");
      console.log(results);
      queueItem.update({
        status: "completed",
      });
    })
    .catch((e) => {
      console.log("pySnap Failed", e);
      queueItem.update({
        status: "failed",
      });
    });
};
