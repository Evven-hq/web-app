import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { passwordMotion } from "./auth-motion";

export function PasswordField({
  value,
  onChange,
  showPassword,
  onToggleShow,
  placeholder = "••••••••",
  autoComplete,
  minLength,
  maxLength,
  animated = false,
}: {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  animated?: boolean;
}) {
  const input = (
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={(event) =>
        onChange(maxLength ? event.target.value.slice(0, maxLength) : event.target.value)
      }
      required
      minLength={minLength}
      maxLength={maxLength}
      autoComplete={autoComplete}
      className="h-12 rounded-2xl border-border/60 bg-background/55 pr-10 transition-all duration-200 focus:border-primary focus:bg-background"
    />
  );

  const toggle = (
    <button
      type="button"
      onClick={onToggleShow}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
    >
      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
    </button>
  );

  if (animated) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={showPassword ? "password-visible" : "password-hidden"}
          {...passwordMotion}
          className="relative"
        >
          {input}
          {toggle}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="relative">
      {input}
      {toggle}
    </div>
  );
}
