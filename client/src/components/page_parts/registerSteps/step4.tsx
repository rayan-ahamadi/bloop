import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import Image from "next/image"

interface Props {
    form: UseFormReturn
}

export default function Step4({ form }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Photo de profil</FormLabel>
                        <FormControl>
                            <>
                                {field.value && typeof field.value === "object" && (
                                    <div className="mb-6 m-auto" style={{ width: 110, height: 110, position: "relative" }}>
                                        <Image
                                            src={URL.createObjectURL(field.value)}
                                            alt="Aperçu de la photo de profil"
                                            width={110}
                                            height={110}
                                            loading="lazy"
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: "0.375rem",
                                                border: "2px solid var(--color-secondary-dark)",
                                                boxShadow: "4px 4px 0 0 black",
                                                width: "110px",
                                                height: "110px",
                                                aspectRatio: "1 / 1"
                                            }}
                                            className="rounded-md border-2 border-secondary-dark shadow-[4px_4px_0_0_black] relative"
                                        />
                                        <p className="block text-center text-xs mt-1 text-gray-600 mb-2">
                                            Aperçu de la photo de profil
                                        </p>
                                    </div>
                                )}

                                <Input type="file" accept="image/*" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        field.onChange(e.target.files[0])
                                    }
                                }} />
                            </>
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
                        <FormLabel>Biographie</FormLabel>
                        <FormControl>
                            <Textarea className="border-2 border-secondary-dark" placeholder="Décrivez-vous (Maximum 500 caractères)" {...field} />
                        </FormControl>
                        <FormDescription>Max 500 caractères</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}