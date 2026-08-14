export type PasswordStrength = {
  label: string;
  helper: string;
  score: number;
  color: string;
};

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      label: "Start typing",
      helper: "Use 8-16 characters with a mix of letters, numbers, and symbols.",
      score: 0,
      color: "var(--evven-text-muted)",
    };
  }

  if (password.length < 8) {
    return {
      label: "Too short",
      helper: `You need ${8 - password.length} more character${8 - password.length === 1 ? "" : "s"} to reach the minimum.`,
      score: 1,
      color: "var(--evven-error)",
    };
  }

  if (password.length > 16) {
    return {
      label: "Too long",
      helper: "Keep it to 16 characters or fewer.",
      score: 1,
      color: "var(--evven-error)",
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (variety <= 1) {
    return {
      label: "Weak",
      helper: "Add a mix of uppercase, lowercase, numbers, and symbols.",
      score: 1,
      color: "var(--evven-error)",
    };
  }

  if (variety === 2) {
    return {
      label: "Fair",
      helper: "A little more variety will make this stronger.",
      score: 2,
      color: "#c08a18",
    };
  }

  if (variety === 3) {
    return {
      label: "Good",
      helper: "This has a solid mix of length and character variety.",
      score: 3,
      color: "var(--evven-accent-primary)",
    };
  }

  return {
    label: "Strong",
    helper: "Great balance. This is a strong password.",
    score: 4,
    color: "var(--evven-accent-primary)",
  };
}
