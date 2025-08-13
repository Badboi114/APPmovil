'use client';

import { useState, useEffect, useCallback } from 'react';
import { KeyRound, Copy, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePasswordStore } from '@/hooks/use-password-store';
import { suggestPasswordAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [website, setWebsite] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { passwords, isLoaded } = usePasswordStore();
  const debouncedWebsite = useDebounce(website, 500);
  const { toast } = useToast();

  const handleSuggestion = useCallback(async (site: string) => {
    if (!site.trim() || !isLoaded || passwords.length === 0) {
      setSuggestion('');
      return;
    }
    setIsLoading(true);
    try {
      const result = await suggestPasswordAction({
        websiteOrAppName: site,
        storedPasswords: passwords.map(p => ({ websiteOrAppName: p.website, password: p.password })),
      });
      setSuggestion(result.suggestedPassword);
    } catch (error) {
      console.error("Suggestion failed:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo obtener la sugerencia.' });
    } finally {
      setIsLoading(false);
    }
  }, [passwords, isLoaded, toast]);

  useEffect(() => {
    handleSuggestion(debouncedWebsite);
  }, [debouncedWebsite, handleSuggestion]);
  
  const handleCopy = () => {
    if (!suggestion) return;
    navigator.clipboard.writeText(suggestion);
    toast({ title: "¡Copiado!", description: "Contraseña sugerida copiada al portapapeles." });
  };

  if (!isLoaded) return null;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-24 right-4 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95 pointer-events-none"
        )}
      >
        <Card className="w-80 shadow-2xl border-2 border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Sugerencia de Contraseña</CardTitle>
              <CardDescription>Para la app/sitio actual</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Ej: Google, Facebook"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <div className="flex items-center bg-muted rounded-md p-2 h-12">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
              ) : suggestion ? (
                <>
                  <p className="flex-1 font-mono truncate">{'*'.repeat(suggestion.length)}</p>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center w-full">
                  {debouncedWebsite ? 'No se encontró coincidencia.' : 'Escribe un sitio web.'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          aria-label="Abrir widget de sugerencias"
          className="rounded-full h-16 w-16 bg-accent hover:bg-accent/90 shadow-lg transform transition-transform hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          <KeyRound className="h-8 w-8" />
        </Button>
      </div>
    </>
  );
}
