
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
       <div className="w-full max-w-md mx-auto">
        <Card>
           <CardHeader className="space-y-1 text-center">
             <div className="flex items-center justify-center gap-2 mb-4">
              <Bot size={32} className="text-primary" />
              <h1 className="text-2xl font-bold font-grotesk">Sales Insights Hub</h1>
            </div>
            <CardTitle className="text-2xl">Criar uma conta</CardTitle>
            <CardDescription>
              Digite suas informações para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
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
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
