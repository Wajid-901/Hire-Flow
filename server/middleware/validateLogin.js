const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();
