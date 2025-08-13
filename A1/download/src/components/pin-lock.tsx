'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

// For demo purposes, the PIN is hardcoded. In a real app, this would be securely managed.
const CORRECT_PIN = '1234';

interface PinLockProps {
  onUnlock: () => void;
}

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      onUnlock();
    } else {
      setError('PIN inválido. Inténtalo de nuevo.');
      setPin('');
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value;
    // Allow only digits and limit length to 4
    if (/^\d*$/.test(newPin) && newPin.length <= 4) {
      setPin(newPin);
      setError('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <form onSubmit={handlePinSubmit}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">PassVault Bloqueado</CardTitle>
            <CardDescription>Ingresa tu PIN para desbloquear tu bóveda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              value={pin}
              onChange={handlePinChange}
              placeholder="****"
              maxLength={4}
              className="text-center text-2xl tracking-[1rem]"
              aria-label="PIN"
              autoFocus
            />
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={pin.length !== 4}>
              Desbloquear
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
