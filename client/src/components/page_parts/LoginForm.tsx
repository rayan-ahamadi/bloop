"use client"

import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from 'next/navigation'
import { loginUser } from "@/services/API/user.api"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"



const schema = z.object({
  username: z.string().min(1, { message: "Ce compte n'existe pas" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
})




function LoginForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = form.getValues();
    const response = await loginUser({
      username: formData.username,
      password: formData.password,
    });

    if (response) {
      console.log("Connexion réussie", response);
      localStorage.setItem("token", response.token);
      redirect("/dashboard");
    } else {
      console.error("Erreur lors de la connexion");
      toast.error("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
    }

  }




  return (
    <Form {...form}>
      <form onSubmit={onSubmit} action="#" className="flex flex-col gap-4">
        <Toaster richColors position="top-center" closeButton={false} />

        <div className="flex flex-col gap-2 ">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d&apos;utilisateur</FormLabel>
                <FormControl>
                  <Input  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de Passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <Input type="submit" value={"Connexion ›"} className="bg-primary shadow-xs hover:bg-primary/90 w-full border-2 border-secondary-dark text-secondary-dark hover:shadow-[4px_4px_0_0_black] ease-in duration-100 font-bold cursor-pointer" />
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }