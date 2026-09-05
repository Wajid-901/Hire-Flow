import { z } from "zod";
import { APPLICATION_STATUS } from "../constants/applicationConstants.js";

const requiredText = (label, maxLength) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} is too long`);

const optionalText = (maxLength) =>
  z
    .string()
    .trim()
    .max(maxLength, `Must be at most ${maxLength} characters`)
    .optional();

const dateInputSchema = z.union([
  z.string().refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    "Invalid date"
  ),
  z.date(),
]);

const nullableDateSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  dateInputSchema.nullable().optional()
);

const createApplicationSchema = z
  .object({
    companyName: requiredText("Company name", 150),
    jobRole: requiredText("Job role", 150),
    jobLink: optionalText(2048),
    appliedDate: nullableDateSchema,
    status: z.enum(APPLICATION_STATUS),
    source: optionalText(200),
    location: optionalText(200),
    workType: z.enum(["Remote", "Hybrid", "On-site", ""]).optional(),
    resumeVersion: optionalText(200),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    notes: optionalText(5000),
    followUpDate: nullableDateSchema,
    interviewDate: nullableDateSchema,
  })
  .strict();

const updateApplicationSchema = createApplicationSchema
  .partial()
  .strict()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided.",
      });
    }
  });

const formatErrors = (issues) =>
  issues.map((issue) => ({
    field: issue.path[0],
    message: issue.message,
  }));

export const validateApplication = (req, res, next) => {
  const result = createApplicationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: formatErrors(result.error.issues),
    });
  }

  req.body = result.data;
  next();
};

export const validateUpdateApplication = (req, res, next) => {
  const result = updateApplicationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: formatErrors(result.error.issues),
    });
  }

  req.body = result.data;
  next();
};