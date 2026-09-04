import { z } from "zod";

const registerSchema = z.object({
  name:     z.string().trim().min(2, "Name must be at least 2 characters"),
  email:    z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message || "Invalid input.",
      errors: result.error.issues.map((issue) => ({
        field:   issue.path[0],
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};