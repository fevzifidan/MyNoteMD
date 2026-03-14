"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "./validations/loginSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Apple } from "lucide-react";

import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await login({ email: data.identifier, password: data.password });
      if (res) {
        navigate("/home");
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    // Ekranda tam ortalamak için min-h-screen ve flex kullanıyoruz. 
    // Arka plan rengi vermedik, shadcn default (bg-background) kullanacak.
    <div className="min-h-[100dvh] flex items-center justify-center w-full px-0 sm:px-0 md:px-0">

      <Card className="w-full max-w-[540px] border-none shadow-2xl rounded-[3rem] bg-card text-card-foreground overflow-hidden my-auto">
        <CardContent className="p-8 md:p-14 space-y-10">

          {/* Header Bölümü */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold tracking-tight">Login</h1>
            <p className="text-muted-foreground text-lg font-medium">
              Access your notes and collections
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="test@test.com"
                          {...field}
                          className="h-14 rounded-full border-none bg-secondary/50 px-8 text-base focus-visible:ring-2 focus-visible:ring-[#3D5278]"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="••••••••••••"
                          {...field}
                          className="h-14 rounded-full border-none bg-secondary/50 px-8 text-base focus-visible:ring-2 focus-visible:ring-[#3D5278]"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#3D5278] hover:bg-[#2e3e5c] text-white rounded-full px-12 h-14 text-lg font-bold shadow-lg shadow-[#3D5278]/20 transition-all active:scale-95"
                >
                  {loading ? "..." : "LOGIN"}
                </Button>

                <Button variant="link" type="button" className="text-muted-foreground font-semibold hover:text-foreground">
                  Forgot password?
                </Button>
              </div>
            </form>
          </Form>

          {/* Sosyal Girişler */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="outline" className="flex-1 rounded-full bg-secondary/30 border-none h-12 gap-3 hover:bg-secondary/50">
              <Chrome className="w-4 h-4 text-red-500" />
              <span className="text-sm font-bold opacity-80">Continue with Google</span>
            </Button>
            <Button variant="outline" className="flex-1 rounded-full bg-secondary/30 border-none h-12 gap-3 hover:bg-secondary/50">
              <Apple className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold opacity-80">Continue with Apple</span>
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-border flex justify-between items-center px-2">
            <span className="text-muted-foreground font-medium">Don't have your account?</span>
            <Button onClick={() => navigate("/register")} variant="link" className="text-primary font-bold p-0 text-lg hover:no-underline">
              Sign up
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;