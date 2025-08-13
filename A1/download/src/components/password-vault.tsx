'use client';

import { useState } from 'react';
import { usePasswordStore } from '@/hooks/use-password-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Plus, Trash2, KeyRound, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  website: z.string().min(1, 'El sitio web es requerido'),
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export function PasswordVault() {
  const { passwords, addPassword, deletePassword, isLoaded } = usePasswordStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { website: '', username: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    addPassword(values);
    toast({ title: 'Éxito', description: 'Contraseña guardada en tu bóveda.' });
    form.reset();
    setOpen(false);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    const typeInSpanish = type === 'Password' ? 'Contraseña' : 'Usuario';
    toast({ title: '¡Copiado!', description: `${typeInSpanish} copiada al portapapeles.` });
  };
  
  const groupedPasswords = passwords.reduce((acc, p) => {
    (acc[p.website] = acc[p.website] || []).push(p);
    return acc;
  }, {} as Record<string, typeof passwords>);

  if (!isLoaded) {
    return <Card><CardHeader><CardTitle>Cargando Bóveda...</CardTitle></CardHeader><CardContent><div className="text-center py-10"><Loader2 className="mx-auto h-12 w-12 animate-spin" /></div></CardContent></Card>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Bóveda de Contraseñas</CardTitle>
          <CardDescription>Tus contraseñas guardadas.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Añadir Nueva
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Contraseña</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="website">Sitio Web/App</Label>
                <Input id="website" {...form.register('website')} />
                {form.formState.errors.website && <p className="text-destructive text-sm mt-1">{form.formState.errors.website.message}</p>}
              </div>
              <div>
                <Label htmlFor="username">Usuario/Email</Label>
                <Input id="username" {...form.register('username')} />
                {form.formState.errors.username && <p className="text-destructive text-sm mt-1">{form.formState.errors.username.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" {...form.register('password')} />
                {form.formState.errors.password && <p className="text-destructive text-sm mt-1">{form.formState.errors.password.message}</p>}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {passwords.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <KeyRound className="mx-auto h-12 w-12" />
            <p className="mt-4">Tu bóveda está vacía.</p>
            <p>Añade una contraseña para empezar.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedPasswords).map(([website, entries]) => (
              <AccordionItem value={website} key={website}>
                <AccordionTrigger className="text-lg">{website}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {entries.map((entry) => (
                      <li key={entry.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-mono">{entry.username}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(entry.password, 'Password')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deletePassword(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
