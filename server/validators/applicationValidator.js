import { z } from "zod";
import { APPLICATION_STATUS } from "../constants/applicationConstants.js";

const applicationSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),

  jobRole: z.string().trim().min(1, "Job role is required"),

  status: z.enum(APPLICATION_STATUS),
});

export const validateApplication = (req, res, next) => {
  const result = applicationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  next();
};

const updateApplicationSchema = applicationSchema.partial();

export const validateUpdateApplication = (req, res, next) => {
    const result = updateApplicationSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            })),
        });
    }

    next();
};