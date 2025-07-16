"use client"

import { Form, FormField, FormLabel, FormControl, FormMessage, FormDescription, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { redirect } from 'next/navigation'


const Step1Schema = z.object({
  name: z.string().min(2, { message: "Nom trop court (Min 2 caractères)" }),
  email: z.string().email({ message: "Email invalide" }),
  birthdate: z.string()
})

const Step2Schema = z.object({
  password: z.string().min(6, { message: "Min 6 caractères" }),
  confirmPassword: z.string().min(6, { message: "Min 6 caractères" }),
  terms: z.boolean().refine((val) => val, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })


const Step3Schema = z.object({
  themes: z.array(z.string()).min(5, { message: "Sélectionnez au moins 5 thèmes" }),
})

const Step4Schema = z.object({
  profilePicture: z.instanceof(File).refine(file => file.size <= 2 * 1024 * 1024, {
    message: "La taille du fichier doit être inférieure à 2 Mo",
  }),
  bio: z.string().max(500, { message: "Bio trop longue" }),
})

// Schéma global final (fusion des étapes)
const FinalSchema = z.object({
  ...Step1Schema.shape,
  ...Step2Schema.shape,
  ...Step3Schema.shape,
  ...Step4Schema.shape,
})

function RegisterForm() {
  const form = useForm<z.infer<typeof FinalSchema>>({
    resolver: zodResolver(FinalSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: "",
      terms: false,
      themes: [],
      profilePicture: undefined,
      bio: "",
    },
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = form.getValues();
    console.log(formData);
    redirect("/dashboard");
  }

  const [step, setStep] = useState(1)

  async function nextStep() {
    let valid;
    if (step === 1) {
      valid = await form.trigger(["name", "email", "birthdate"])
    }
    else if (step === 2) {
      valid = await form.trigger(["password", "confirmPassword", "terms"])
    }
    else if (step === 3) {
      valid = await form.trigger(["themes"])
    }
    else if (step === 4) {
      valid = await form.trigger(["profilePicture", "bio"])
    }
    if (valid) {
      setStep((prev) => prev + 1)
    } else {
      console.log("Erreur lors de l'étape")
    }

  }

  async function prevStep() {
    setStep((prev) => prev - 1)
  }


  const themeOptions = [
    "Jeux vidéo",
    "Musique",
    "Art",
    "Sport",
    "Technologie",
    "Cinéma",
    "Voyage",
    "Cuisine",
  ]


  return (
    <Form {...form}>
      <form onSubmit={onSubmit} action="#" className="flex flex-col gap-4">

        {/* Première étape */}
        {step === 1 && (
          <div className="flex flex-col gap-2 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de naissance</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max={new Date(
                        new Date().setFullYear(new Date().getFullYear() - 13)
                      )
                        .toISOString()
                        .split("T")[0]}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Votre date de naissance nous aide à personnaliser votre expérience.
                    Il ne sera pas affiché publiquement.
                  </FormDescription>
                </FormItem>
              )}
            />

          </div>
        )}

        {/* Deuxième étape */}
        {step === 2 && (
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 flex-wrap">
                  <FormLabel className="mb-0">Accepter les conditions d'utilisation</FormLabel>
                  <FormControl>
                    <Input type="checkbox" {...field} className="ml-2" />
                  </FormControl>
                  <FormDescription className="w-full">
                    En vous inscrivant, vous acceptez nos <a href="/terms" className="text-primary">conditions d'utilisation</a>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        )}

        {/* Troisième étape */}
        {step === 3 && (
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="themes"
              render={() => (
                <FormItem>
                  <FormLabel>Thèmes préférés</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {themeOptions.map((theme) => (
                      <FormField
                        key={theme}
                        control={form.control}
                        name="themes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={theme}
                              className="flex items-center space-x-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(theme)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, theme]
                                      : field.value.filter((item) => item !== theme)
                                    field.onChange(newValue)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{theme}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Choisissez au moins 5 centres d’intérêt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Quatrième étape */}
        {step === 4 && (
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo de profil</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        field.onChange(e.target.files[0])
                      }
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input type="textfield" {...field} />
                  </FormControl>
                  <FormDescription>Max 500 caractères</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          {step > 1 && <Button type="button" variant={"secondaryNoShadow"} onClick={prevStep}>‹ Précédent</Button>}
          {step < 4 ? (
            <Button type="button" variant={"defaultNoShadow"} onClick={nextStep}>Suivant ›</Button>
          ) : (
            <Input type="submit" value={"S'inscrire ›"} className="font-bold" />
          )}
        </div>
      </form>
    </Form>
  )
}

export { RegisterForm }