import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { RegisterForm } from "@/components/page_parts/RegisterForm";
import { LoginForm } from "@/components/page_parts/LoginForm";


export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <div id="title-box" className="bg-secondary-dark/100 text-secondary/100 p-8 flex-grow-1 flex flex-col justify-between">
        <Image
          src="/images/logo/yeuxbloop.png"
          alt="Bloop Logo"
          width={50}
          height={50}
          className="mx-auto mb-4"
        />
        <h1 className="font-[900] text-[88px] text-left" style={{ lineHeight: "60%" }}>
        BIENVENUE SUR
          <Image
            src="/images/logo/bloop.png"
            alt="Bloop Logo"
            width={200}
            height={50}
            className="inline-block ml-3 align-middle translate-y-[-9%]"
          />
        </h1>
      </div>
      <div id="button-box" className="flex flex-col gap-3 bg-secondary/100 text-secondary-dark/100 flex-grow-0 ">
        <div id="apis" className="p-8 flex flex-col gap-3">
          <Button className="text-[17px] flex flex-row justify-center items-center">
            {/* <Image 
              src="/images/icons/Google.png"
              alt="google-logo"
              height={30}
              width={30}
            /> */}
            Continuer avec Google
          </Button>
          <Button className="text-[17px] flex flex-row justify-center items-center">
            {/* <Image 
              src="/images/icons/Apple Inc.png"
              alt="apple-logo"
              height={30}
              width={30}
            /> */}
            Continuer avec Apple
          </Button>
        </div>
        
       
        <div id="separator" className="flex w-full">
          <hr className="flex-grow border-t border-secondary-dark/100" />
        </div>

        <div id="email" className="p-8 flex flex-col gap-3 h-full ">
          <Dialog>
            <DialogTrigger>
                <Button className="mb-5 text-[17px] flex flex-row justify-center items-center">
                {/* <Image 
                  src="/images/icons/+.png"
                  alt="+ icons"
                  height={30}
                  width={30}
                /> */}
                Créez un compte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              {/* Contenu de la modal */}
              <RegisterForm />
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
          

          <p className="text-[14px]">En vous inscrivant, vous acceptez nos <Link href={"#"} className="text-primary">Conditions d’utilisation</Link> , notre <Link href={"#"} className="text-primary">Politique de confidencialité</Link>  et notre <Link href={"#"} className="text-primary">Utilisation des cookies</Link>.</p>
          <p className="text-[14px] mt-15">Vous avez déjà un compte ? 
            <Dialog>
            <DialogTrigger>
                <span className="text-primary">&nbsp; Connectez-vous</span> 
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              {/* Contenu de la modal */}
              <LoginForm />
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
          </p>
        </div>

        
      </div>
      
    </div>
  );
}
