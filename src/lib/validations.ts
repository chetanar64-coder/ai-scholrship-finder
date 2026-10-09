import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  cgpa: z.coerce
    .number()
    .min(0, "CGPA must be at least 0")
    .max(10, "CGPA cannot exceed 10"),
  familyIncome: z.coerce
    .number()
    .min(0, "Income must be at least 0"),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"], {
    message: "Please select a valid category",
  }),
  course: z.enum(
    [
      "B.Tech",
      "M.Tech",
      "MBA",
      "MCA",
      "PhD",
      "B.Sc",
      "M.Sc",
      "B.Com",
      "Other",
    ],
    {
      message: "Please select a valid course",
    }
  ),
  semester: z.coerce
    .number()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  achievements: z.string().max(1000, "Achievements text is too long").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
