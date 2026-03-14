"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";
import { registerSchema } from "./validations/registerSchema";
import apiService from "@/shared/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Apple, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: "", surname: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // 1. Kayıt Ol
      await apiService.post("/auth/register", {
        givenName: data.name,
        familyName: data.surname,
        email: data.email,
        password: data.password,
      });

      // 2. Başarılı ise login yap
      await login({ email: data.email, password: data.password });
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  // Ortak Input Sınıfları (Varyant olarak da tanımlanabilir)
  const inputClasses = "h-14 rounded-full border-none bg-secondary/50 px-8 text-base focus-visible:ring-2 focus-visible:ring-[#3D5278] transition-all";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center w-full p-4">
      <Card className="w-full max-w-[580px] border-none shadow-2xl rounded-[3rem] bg-card text-card-foreground overflow-hidden">
        <CardContent className="p-8 md:p-14 space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Join Us</h1>
            <p className="text-muted-foreground text-lg font-medium">
              Create your account to start collecting
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Input placeholder="Given Name" {...field} className={inputClasses} />
                        <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-[#3D5278] transition-colors" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {/* Surname Field */}
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Input placeholder="Family Name" {...field} className={inputClasses} />
                        <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-[#3D5278] transition-colors" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Input placeholder="Email Address" {...field} className={inputClasses} />
                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-[#3D5278] transition-colors" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Input type="password" placeholder="Password" {...field} className={inputClasses} />
                        <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-[#3D5278] transition-colors" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Input type="password" placeholder="Confirm Password" {...field} className={inputClasses} />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3D5278] hover:bg-[#2e3e5c] text-white rounded-full h-14 text-lg font-bold shadow-lg shadow-[#3D5278]/20 transition-all active:scale-[0.98]"
                >
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </Button>
              </div>
            </form>
          </Form>

          {/* Social Register */}
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-border"></span>
              <span className="relative bg-card px-4 text-sm text-muted-foreground font-medium">Or register with</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1 rounded-full bg-secondary/30 border-none h-12 gap-3 hover:bg-secondary/50 transition-colors">
                <Chrome className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold opacity-80">Google</span>
              </Button>
              <Button variant="outline" className="flex-1 rounded-full bg-secondary/30 border-none h-12 gap-3 hover:bg-secondary/50 transition-colors">
                <Apple className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold opacity-80">Apple</span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-border flex justify-between items-center px-2">
            <span className="text-muted-foreground font-medium">Already have an account?</span>
            <Button onClick={() => navigate("/login")} variant="link" className="text-[#3D5278] dark:text-blue-400 font-bold p-0 text-lg hover:no-underline">
              Sign in
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;