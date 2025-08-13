'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Copy, RefreshCw, Loader2 } from 'lucide-react';
import { generatePasswordAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  length: z.number().min(8).max(64).default(16),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
});

export function PasswordGenerator() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 16,
      includeNumbers: true,
      includeSymbols: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    setGeneratedPassword('');
    try {
      const result = await generatePasswordAction({
        ...values,
      });
      setGeneratedPassword(result.password);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al generar la contraseña. Inténtalo de nuevo.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "¡Copiado!",
      description: "La contraseña ha sido copiada a tu portapapeles.",
    });
  };

  return (
    <Card className="border-2 border-accent/50 shadow-lg shadow-accent/10">
      <CardHeader>
        <CardTitle className="text-2xl">Generador de Contraseñas</CardTitle>
        <CardDescription>Crea una contraseña fuerte y segura.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center bg-input/50 rounded-md p-4">
              <Input
                readOnly
                value={generatedPassword}
                placeholder="Haz clic en 'Generar'..."
                className="text-lg tracking-wider flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="button" variant="ghost" size="icon" onClick={handleCopyToClipboard} disabled={!generatedPassword}>
                <Copy className="h-5 w-5" />
                <span className="sr-only">Copiar contraseña</span>
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Longitud de Contraseña</FormLabel>
                    <span className="text-primary font-bold">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={8}
                      max={64}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="includeNumbers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base cursor-pointer">Incluir Números</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeSymbols"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base cursor-pointer">Incluir Símbolos</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Generar Contraseña
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
