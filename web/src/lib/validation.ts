import { CreateFormRequest } from "@/schemas/tally/requests/create-form-request";

export type ValidationResult =
  | { ok: true; data: CreateFormRequest }
  | { ok: false; errors: Array<{ path: string; message: string }> };

export function validateBeforeSubmit(draft: unknown): ValidationResult {
  const r = CreateFormRequest.safeParse(draft);
  if (!r.success) {
    return {
      ok: false,
      errors: r.error.issues.map(i => ({
        path: i.path.join(".") || "(root)",
        message: i.message,
      })),
    };
  }
  return { ok: true, data: r.data };
}
