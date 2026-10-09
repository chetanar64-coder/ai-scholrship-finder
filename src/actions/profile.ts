"use server";

import { prisma } from "@/lib/db";
import { profileSchema, type ProfileFormData } from "@/lib/validations";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function saveProfile(
  formData: ProfileFormData
): Promise<ActionResult> {
  // 1. Re-validate on the server (never trust client-side validation alone)
  const parsed = profileSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Validation failed";
    return { success: false, error: firstError };
  }

  const { name, email, cgpa, familyIncome, category, course, semester, achievements } =
    parsed.data;

  try {
    // 2. Upsert user by email (create or update)
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        cgpa,           // already a number via z.coerce.number()
        familyIncome,   // already a number via z.coerce.number()
        category,
        course,
        semester,       // already a number via z.coerce.number()
        achievements: achievements ?? "",
      },
      create: {
        name,
        email,
        cgpa,
        familyIncome,
        category,
        course,
        semester,
        achievements: achievements ?? "",
      },
    });

    return { success: true, message: "Profile saved successfully!" };
  } catch (err) {
    console.error("[saveProfile] DB error:", err);
    return {
      success: false,
      error: "Failed to save profile. Please try again.",
    };
  }
}
