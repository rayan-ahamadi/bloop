"use client";

import { useUserStore } from "@/stores/user.stores";
import { usePostStore } from "@/stores/post.stores";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import ImageIcon from "@/components/icons/image-icon.svg";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
    content: z.string().min(1, { message: "Le contenu du bloop ne peut pas être vide" }),
    image: z
        .instanceof(File)
        .optional()
        .refine(file => !file || file.size <= 2 * 1024 * 1024, {
            message: "L'image doit faire moins de 2 Mo",
        }),
    type: z.literal("original"),
    language: z.string().optional(),
});

export default function BloopPost() {
    const { user } = useUserStore();
    const { addPost, loading } = usePostStore();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: "",
            image: undefined,
            type: "original",
            language: "fr",
        },
    });

    async function handlePost(data: z.infer<typeof schema>) {
        try {
            if (user) {
                await addPost({
                    content: data.content,
                    image: data.image,
                    type: "original",
                    language: "fr",
                });
                toast.success("Bloop posté avec succès!");
                form.reset();
            } else {
                toast.error("Vous devez être connecté pour poster un bloop.");
            }
        } catch (error) {
            toast.error("Erreur lors de la publication du bloop.");
        }
    }

    return (
        <Form {...form}>
            <div className="w-full hidden md:block sticky top-0 bg-white">
                <Toaster richColors position="top-center" closeButton={false} />
                <form
                    onSubmit={form.handleSubmit(handlePost)}
                    className="inputs flex flex-row items-start gap-2 p-4 border-b-2 border-secondary-dark"
                >
                    <Image
                        src={
                            "https://localhost:8000" +
                            (user?.avatarUrl || "/uploads/avatars/user.png")
                        }
                        alt={"Avatar"}
                        width={45}
                        height={45}
                        className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] mr-2 h-auto bg-accent"
                    />

                    <div className="flex flex-col flex-grow">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Quelque chose à dire ?"
                                            {...field}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row justify-between items-center mt-2">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="image-upload" className="sr-only">
                                            Ajouter une image
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    field.onChange(e.target.files?.[0]);
                                                }}
                                            />
                                        </FormControl>
                                        <ImageIcon
                                            className="cursor-pointer hover:fill-accent/80"
                                            onClick={() =>
                                                document.getElementById("image-upload")?.click()
                                            }
                                        />
                                        {field.value && typeof field.value === "object" && (
                                            <div className="mb-6 m-auto" style={{ position: "relative" }}>
                                                <Image
                                                    src={URL.createObjectURL(field.value)}
                                                    alt="Aperçu de l'image"
                                                    width={500}
                                                    height={500}
                                                    loading="lazy"
                                                    style={{
                                                        objectFit: "cover",
                                                        borderRadius: "0.375rem",
                                                        border: "2px solid var(--color-secondary-dark)",
                                                        boxShadow: "4px 4px 0 0 black",
                                                        width: "auto !important",
                                                        height: "auto !important",
                                                    }}
                                                    className="rounded-md border-2 border-secondary-dark shadow-[4px_4px_0_0_black] relative"
                                                />
                                                <p className="block text-center text-xs mt-1 text-gray-600 mb-2">
                                                    Aperçu de l'image
                                                </p>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="size-fit py-[6px] px-[20px] font-bold text-[16px] ml-auto"
                            disabled={loading}
                        >
                            Poster
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
}