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
    <div className="flex flex-col md:flex-row h-full">
      <div id="title-box" className="bg-secondary-dark/100 text-secondary/100 p-8 flex-grow-1 flex flex-col justify-between md:justify-center md:items-center ">
        <Image
          src="/images/logo/yeuxbloop.png"
          alt="Bloop Logo"
          width={50}
          height={50}
          className="mx-auto mb-4 md:hidden"
        />
        <div className="title-with-logo">
          <h1 style={{ width: "9ch" }}>
            BIENVENUE SUR

          </h1>
        </div>
      </div>
      <div id="button-box" className="flex flex-col justify-center  bg-secondary/100 text-secondary-dark/100 flex-grow-1 ">

        <div id="apis" className="p-8 flex flex-col gap-6 flex-grow-0 md:px-20">
          <h2 className="hidden md:block  md:text-[75px] leading-15 w-[15ch] font-extrabold text-left mt-25">
            Un réseau social
            sans le stress social
          </h2>
          <h3 className="hidden md:block text-[45px] font-extrabold text-left">
            Inscrivez-vous
          </h3>
          <Button className="text-[17px] flex flex-row justify-center items-center md:w-2/4 md:text-[20px]">
            <Image
              className="mr-2"
              src="/images/icons/google.svg"
              alt="google-logo"
              height={20}
              width={20}
            />
            Continuer avec Google
          </Button>
          <Button className="text-[17px] flex flex-row justify-center items-center md:w-2/4 md:text-[20px]">
            <Image
              className="mr-2"
              src="/images/icons/apple.svg"
              alt="apple-logo"
              height={20}
              width={20}
            />
            Continuer avec Apple
          </Button>
        </div>


        <div id="separator" className="flex w-full">
          <hr className="flex-grow border-t border-[1.5px] border-secondary-dark/100" />
        </div>

        <div id="email" className="p-8 flex flex-col gap-1 flex-grow-1 md:px-20 ">
          <Dialog>
            <DialogTrigger variant="default" className="md:mt-2 mb-5 text-[17px] flex flex-row justify-center items-center md:w-2/4 md:text-[20px]">
              <Image
                className="mr-2"
                src="/images/icons/+.svg"
                alt="+ icons"
                height={20}
                width={20}
              />
              <span>Créez un compte</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  Inscrivez-vous !
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              {/* Contenu de la modal */}
              <RegisterForm />
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>


          <p className="text-[14px] w-2/4">En vous inscrivant, vous acceptez nos <Link href={"#"} className="text-primary">Conditions d’utilisation</Link> , notre <Link href={"#"} className="text-primary">Politique de confidentialité </Link>  et notre <Link href={"#"} className="text-primary">Utilisation des cookies</Link>.</p>
          <p className="text-[14px] flex-grow-1 mt-4">Vous avez déjà un compte ?
            <Dialog>
              <DialogTrigger className="md:flex flex-row justify-center items-center md:mt-5 md:w-2/4 " variant="accent">
                <span className="text-primary cursor-pointer md:hidden">&nbsp; Connectez-vous</span>
                <span className="hidden w-full h-full text-[20px] md:flex flex-row justify-center items-center">
                  Se connecter
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">
                    Connectez-vous !
                  </DialogTitle>
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
