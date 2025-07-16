"use client"

import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from 'next/navigation'



const schema = z.object({
  username: z.string().min(1, { message: "Ce compte n'existe pas" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
})




function LoginForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = form.getValues();
    console.log(formData);
    redirect("/dashboard");
  }




  return (
    <Form {...form}>
      <form onSubmit={onSubmit} action="#" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
          <Input type="submit" value={"Connexion ›"} className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 w-full border-2 border-secondary-dark text-secondary-dark hover:shadow-[4px_4px_0_0_black] ease-in duration-100  font-bold" />
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }