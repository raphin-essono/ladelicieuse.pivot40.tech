import { useContext } from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { cn } from '@/lib/utils';

// ── Slot individuel ───────────────────────────────────────────────────────────

interface SlotProps {
  index:     number;
  hasError:  boolean;
  isLoading: boolean;
}

function Slot({ index, hasError, isLoading }: SlotProps) {
  const { slots } = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = slots[index];
  const filled = !!char;

  return (
    <div
      className={cn(
        // Layout & shape
        'relative flex items-center justify-center',
        'w-11 h-14 sm:w-[52px] sm:h-[60px]',
        'rounded-2xl border-2 overflow-hidden select-none cursor-default',
        // Typography
        'font-display text-[26px] sm:text-[28px] font-semibold leading-none',
        // Smooth transitions
        'transition-all duration-200 ease-out',

        // ── État par défaut ──
        'bg-white border-border text-foreground shadow-sm',

        // ── Rempli + inactif ──
        filled && !isActive && !hasError && [
          'border-primary/50 bg-primary/5 text-primary',
          'animate-otp-pop',
        ],

        // ── Slot actif (focus) ──
        isActive && !hasError && [
          'border-primary bg-white text-foreground',
          'shadow-[0_0_0_4px_hsl(var(--ring)/0.18)]',
          'scale-[1.08] z-10',
        ],

        // ── Erreur ──
        hasError && [
          'border-destructive',
          'shadow-[0_0_0_3px_hsl(var(--destructive)/0.15)]',
          'bg-destructive/5',
        ],
        hasError && filled && 'text-destructive',

        // ── Chargement ──
        isLoading && 'opacity-50',
      )}
    >
      {/* Chiffre */}
      {filled && <span className="tabular-nums">{char}</span>}

      {/* Curseur clignotant */}
      {hasFakeCaret && !filled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[2px] h-7 rounded-full bg-primary animate-caret-blink" />
        </div>
      )}

      {/* Lueur active */}
      {isActive && !hasError && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/30 pointer-events-none" />
      )}
    </div>
  );
}

// ── OTPInputField ─────────────────────────────────────────────────────────────

export interface OTPInputFieldProps {
  value:       string;
  onChange:    (value: string) => void;
  onComplete?: (value: string) => void;
  length?:     number;
  disabled?:   boolean;
  hasError?:   boolean;
  isLoading?:  boolean;
  autoFocus?:  boolean;
}

export function OTPInputField({
  value,
  onChange,
  onComplete,
  length     = 6,
  disabled   = false,
  hasError   = false,
  isLoading  = false,
  autoFocus  = true,
}: OTPInputFieldProps) {
  return (
    <div
      className={cn(
        'flex justify-center',
        hasError && 'animate-otp-shake',
      )}
    >
      <OTPInput
        maxLength={length}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        disabled={disabled || isLoading}
        autoFocus={autoFocus}
        inputMode="numeric"
        pattern="\d*"
        autoComplete="one-time-code"
        spellCheck={false}
        containerClassName={cn(
          'flex items-center gap-2 sm:gap-3',
          (disabled || isLoading) && 'pointer-events-none',
        )}
      >
        {Array.from({ length }, (_, i) => (
          <Slot
            key={i}
            index={i}
            hasError={hasError}
            isLoading={isLoading}
          />
        ))}
      </OTPInput>
    </div>
  );
}
