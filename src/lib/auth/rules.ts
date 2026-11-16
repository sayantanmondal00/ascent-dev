/* Shared sign-up rules (client and server). */
export const USERNAME_RULE = /^[a-z0-9._]{3,20}$/;
export function passwordProblem(p: string): string | null {
  if (p.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) return "Use at least one letter and one number.";
  return null;
}

export function usernameProblem(u: string): string | null {
  if (!USERNAME_RULE.test(u.trim().toLowerCase())) return "Use 3 to 20 letters, numbers, dots or underscores.";
  return null;
}
