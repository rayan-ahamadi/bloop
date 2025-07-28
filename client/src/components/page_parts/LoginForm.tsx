"use client"

import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useUserStore } from "@/stores/user.stores"



const schema = z.object({
  username: z.string().min(1, { message: "Ce compte n'existe pas" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
})




function LoginForm() {
  const { login, error, loading } = useUserStore()
  const router = useRouter()

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

    try {
      await login(formData.username, formData.password); // Utilisation de la fonction login du store
      router.push("/dashboard");
    } catch (error) {
      toast.error("Identifiants incorrects ou réponse invalide.");
      console.error(error);
      return;
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
          {loading ? (
            <div className="flex justify-center items-center">
              <span className="loader"></span>
            </div>)
            :
            (<Input type="submit" value={"Connexion ›"} className="bg-primary shadow-xs hover:bg-primary/90 w-full border-2 border-secondary-dark text-secondary-dark hover:shadow-[4px_4px_0_0_black] ease-in duration-100 font-bold cursor-pointer" />
            )}
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }