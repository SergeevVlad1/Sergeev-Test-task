import { Labels } from "../pages/labels/labels.page";
import { Tasks } from "../pages/tasks/task.page.component";
import { Users } from "../pages/users/users.page";
import { PathEnum } from "./routes.types";


export const routes = [
    {path: PathEnum.USERS, element: <Users />},
    {path: PathEnum.TASKS, element: <Tasks />},
    {path: PathEnum.LABELS, element: <Labels />},
]