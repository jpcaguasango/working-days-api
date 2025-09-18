import { Router } from "express";
import { getWorkingDate } from "../controllers/workingDate.controller";

const router: Router = Router();
router.get("/", getWorkingDate); // GET /working-date

export default router;
