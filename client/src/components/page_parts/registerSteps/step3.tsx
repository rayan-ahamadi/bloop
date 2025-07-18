import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"

interface Props {
    form: UseFormReturn<any>
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


export default function Step3({ form }: Props) {
    return (
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
                                                                ? [...(field.value || []), theme]
                                                                : (field.value || []).filter((item) => item !== theme)
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
    )
}