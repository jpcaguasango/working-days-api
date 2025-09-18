import { Request, Response } from "express";
import { calculateWorkingDate } from "../services/workingDate.service";

export async function getWorkingDate(req: Request, res: Response) {
  try {
    const result = await calculateWorkingDate(req.query);
    res.status(200).json({ date: result.date });
  } catch (err: any) {
    res.status(400).json({ error: "InvalidParameters", message: err.message });
  }
}
