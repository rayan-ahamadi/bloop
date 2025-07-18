import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
    form: UseFormReturn<any>
}

export default function Step2({ form }: Props) {
    return (
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
            <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-2 flex-wrap">
                        <FormLabel className="mb-0">Accepter les conditions d'utilisation</FormLabel>
                        <FormControl>
                            <Checkbox
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                className="ml-2"
                            />
                        </FormControl>
                        <FormDescription className="w-full">
                            En vous inscrivant, vous acceptez nos <a href="/terms" className="text-primary">conditions d'utilisation</a>.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}