import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  minLength?: number;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  className,
  required,
  minLength,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn('pr-10', className)}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors"
        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <Eye className="w-4 h-4" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
