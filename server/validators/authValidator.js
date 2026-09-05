import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

const tokenSchema = z.string().trim().min(1, "Reset token is required");

const handleValidation = (schemas) => {
  return (req, res, next) => {
    const issues = [];
    const parsed = {};

    for (const [source, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({
            field: [source, ...issue.path].filter(Boolean).join("."),
            message: issue.message,
          });
        }
        continue;
      }

      parsed[source] = result.data;
    }

    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: issues[0]?.message || "Invalid input.",
        errors: issues,
      });
    }

    for (const [source, value] of Object.entries(parsed)) {
      req[source] = value;
    }

    next();
  };
};

const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().optional(),
  })
  .strip()
  .superRefine((data, ctx) => {
    if (
      data.confirmPassword !== undefined &&
      data.confirmPassword !== data.password
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strip();

const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strip();

const resetPasswordParamsSchema = z
  .object({
    token: tokenSchema,
  })
  .strip();

const resetPasswordBodySchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().optional(),
  })
  .strip()
  .superRefine((data, ctx) => {
    if (
      data.confirmPassword !== undefined &&
      data.confirmPassword !== data.password
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

const changePasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().optional(),
  })
  .strip()
  .superRefine((data, ctx) => {
    if (
      data.confirmPassword !== undefined &&
      data.confirmPassword !== data.newPassword
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const validateRegister = handleValidation({ body: registerSchema });
export const validateLogin = handleValidation({ body: loginSchema });
export const validateForgotPassword = handleValidation({
  body: forgotPasswordSchema,
});
export const validateResetPassword = handleValidation({
  params: resetPasswordParamsSchema,
  body: resetPasswordBodySchema,
});
export const validateChangePassword = handleValidation({
  body: changePasswordBodySchema,
});
