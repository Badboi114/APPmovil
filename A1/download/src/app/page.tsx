'use client';

import { useState } from 'react';
import { PinLock } from '@/components/pin-lock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, ShieldCheck } from 'lucide-react';
import { PasswordGenerator } from '@/components/password-generator';
import { PasswordVault } from '@/components/password-vault';
import { FloatingWidget } from '@/components/floating-widget';

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return <PinLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">PassVault</h1>
          <p className="text-lg text-muted-foreground mt-2">Tu Compañero Seguro de Contraseñas</p>
        </header>

        <Tabs defaultValue="generator" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">
              <KeyRound className="mr-2 h-4 w-4" />
              Generador
            </TabsTrigger>
            <TabsTrigger value="vault">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Bóveda
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generator">
            <PasswordGenerator />
          </TabsContent>
          <TabsContent value="vault">
            <PasswordVault />
          </TabsContent>
        </Tabs>
      </main>
      <FloatingWidget />
    </>
  );
}
