"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { redirect } from 'next/navigation'
import { registerUser, loginUser } from "@/services/API/user.api"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { FinalSchema } from "./validationSchemas"
import Step1 from "@/components/page_parts/registerSteps/step1"
import Step2 from "@/components/page_parts/registerSteps/step2"
import Step3 from "@/components/page_parts/registerSteps/step3"
import Step4 from "@/components/page_parts/registerSteps/step4"


function RegisterForm() {
  const form = useForm<{
    name: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    avatar: File;
    birthDate: string;
    themes: string[];
    confirmPassword: string;
    terms: boolean;
  }>({
    resolver: zodResolver(FinalSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      bio: "",
      avatar: undefined as unknown as File,
      birthDate: "",
      themes: [],
      confirmPassword: "",
      terms: false,
    },
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = form.getValues();
    console.log(formData);

    const response = await registerUser(formData);
    if (response && !response.error) {
      console.log("Inscription réussie", response);

      // La route qui fournit le token est celui de la connexion
      const loginResponse = await loginUser({
        username: formData.username || "",
        password: formData.password || "",
      });
      if (loginResponse && !loginResponse.error) {
        console.log("Connexion réussie", loginResponse);
        localStorage.setItem("token", loginResponse.token);
      }
      redirect("/dashboard");
    } else {
      console.error("Erreur lors de l'inscription", response?.error || response);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }

  }

  const [step, setStep] = useState(1)

  async function nextStep() {
    console.log(form.formState.errors);
    let valid;
    if (step === 1) {
      valid = await form.trigger(["name", "email", "birthDate"])
    }
    else if (step === 2) {
      valid = await form.trigger(["password", "confirmPassword", "terms"])
    }
    else if (step === 3) {
      valid = await form.trigger(["themes"])
    }
    else if (step === 4) {
      valid = await form.trigger(["avatar", "bio"])
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


  return (
    <Form {...form}>
      <form onSubmit={onSubmit} action="#" className="flex flex-col gap-4">
        <Toaster richColors position="top-center" closeButton={false} />
        {step === 1 && <Step1 form={form} />}
        {step === 2 && <Step2 form={form} />}
        {step === 3 && <Step3 form={form} />}
        {step === 4 && <Step4 form={form} />}

        <div className="flex flex-col gap-3 mt-4">
          {step > 1 && <Button type="button" variant={"secondaryNoShadow"} className="text-2xl" onClick={prevStep}>‹ Précédent</Button>}
          {step < 4 ? (
            <Button type="button" variant={"defaultNoShadow"} className="text-2xl" onClick={nextStep}>Suivant ›</Button>
          ) : (
            <Input type="submit" value={"S'inscrire ›"} className="font-bold bg-primary hover:bg-primary/80" />
          )}
        </div>
      </form>
    </Form>
  )
}

export { RegisterForm }