
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Criar uma conta</h1>
            <p className="text-balance text-muted-foreground">
              Digite suas informações para criar sua conta
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nome</Label>
              <Input id="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" />
            </div>
             <Link href="/dashboard" className="w-full">
              <Button type="submit" className="w-full">
                Criar conta
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-gray-900 lg:flex items-center justify-center text-white flex-col p-8">
        <div className="flex items-center gap-2 mb-4">
            <Bot size={48} className="text-primary" />
            <h1 className="text-4xl font-bold font-grotesk">Sales Insights Hub</h1>
        </div>
        <p className="text-center text-muted-foreground">
            Uma plataforma inteligente para impulsionar suas vendas e estratégias.
        </p>
      </div>
    </div>
  );
}
