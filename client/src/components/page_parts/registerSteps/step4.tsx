import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"

interface Props {
    form: UseFormReturn<any>
}

export default function Step4({ form }: Props) {
    return (
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
    )
}