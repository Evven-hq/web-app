import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="otp" className="text-sm font-medium">
        Verification code
      </Label>
      <Input
        id="otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        required
        maxLength={6}
        className="h-12 rounded-2xl border-border/60 bg-background/55 tracking-[0.35em] text-center text-base font-semibold transition-all duration-200 focus:border-primary focus:bg-background"
      />
    </div>
  );
}
