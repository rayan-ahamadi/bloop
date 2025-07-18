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
    id?: number;
    name: string;
    username?: string;
    email: string | null;
    password?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    birthDate?: string | null;
    themes?: string[];
    confirmPassword?: string;
    terms?: boolean;
    profilePicture?: File;
  }>({
    resolver: zodResolver(FinalSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      terms: false,
      themes: [],
      profilePicture: undefined,
      bio: "",
      avatarUrl: undefined,
      bannerUrl: undefined,
      username: "",
    },
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = form.getValues();
    console.log(formData);

    const response = await registerUser(formData);
    if (response) {
      console.log("Inscription réussie", response);

      // La route qui fournit le token est celui de la connexion
      const loginResponse = await loginUser({
        email: formData.email || "",
        password: formData.password || "",
      });
      if (loginResponse) {
        console.log("Connexion réussie", loginResponse);
        localStorage.setItem("token", loginResponse.token);
      }
      redirect("/dashboard");
    } else {
      console.error("Erreur lors de l'inscription");
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }

  }

  const [step, setStep] = useState(1)

  async function nextStep() {
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


  return (
    <Form {...form}>
      <form onSubmit={onSubmit} action="#" className="flex flex-col gap-4">
        <Toaster richColors position="top-center" closeButton={false} />
        {step === 1 && <Step1 form={form} />}
        {step === 2 && <Step2 form={form} />}
        {step === 3 && <Step3 form={form} />}
        {step === 4 && <Step4 form={form} />}

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