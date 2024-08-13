import { PythonShell } from "python-shell";
import QueueModel from "../models/QueueModel.js";
import WorkSpaceModel from "../models/WorkSpaceModel.js";
import UserModel from "../models/UserModel.js";
import { slugify } from "../utils/misc.js";
import { workerData } from "worker_threads";
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
  // PythonShell.run("main.py", {
  //   scriptPath: PY_SCRIPT_PATH,
  //   args: [workspaceId],
  // })
  //   .then((results) => {
  //     console.log("pySnap Success");
  //     console.log(results);
  //     queueItem.update({
  //       status: "completed",
  //     });
  //   })
  //   .catch((e) => {
  //     console.log("pySnap Failed", e);
  //     queueItem.update({
  //       status: "failed",
  //     });
  //   });
  const workspaceData = await WorkSpaceModel.findOne({
    where: { id: workspaceId },
  });
  // console.log("🚀 ~ pySnap ~ workspaceData:", workspaceData);
  const workspaceName = workspaceData?.get("name") as string;
  // console.log("🚀 ~ pySnap ~ workspaceName:", workspaceName);

  const userId = workspaceData?.get("owner") as string;
  // console.log("🚀 ~ pySnap ~ userId:", userId);
  const userData = await UserModel.findOne({ where: { id: userId } });
  const userName = userData?.get("name") as string;

  const val = `hellosnaps/images/${slugify(userName)}-${userId}/${workspaceName}`;

  console.log("🚀 ~ pySnap ~ val:", val);

  const temp = await fetch("http://localhost:5000/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_name: val,
      workspaceId,
    }),
  });
  const response = await temp.json();
  console.log("🚀 ~ pySnap ~ response:", response);

  return response;
};
