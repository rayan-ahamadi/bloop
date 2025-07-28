import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useUserStore } from "@/stores/user.stores"
import { User } from "@/types/user.types";

type BloopDropdownProps = {
    bloopUser: Partial<User>;
    bloopId: number;
    originalBloop: boolean;
    onDelete: (bloopId: number) => void;
    // onEdit: (bloopId: number) => void;
    onReport: (bloopId: number) => void;
}

export default function BloopDropdown({ bloopUser, bloopId, onDelete, onReport }: BloopDropdownProps) {
    const { user } = useUserStore();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <p className="text-2xl cursor-pointer hover:text-primary font-extrabold"
                    title="Plus d'options">
                    ...
                </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                    {user?.id === bloopUser.id && (
                        <>
                            {/* <DropdownMenuItem onClick={() => onEdit(bloopId)}>
                                Edit
                            </DropdownMenuItem> */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                        }}>
                                        Supprimer
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action ne peut pas être annulée. Cela supprimera définitivement votre bloop.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDelete(bloopId)}>
                                            Supprimer
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}>
                                Signaler
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Signaler ce bloop?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Si vous pensez que ce bloop enfreint nos règles, veuillez le signaler. Nous examinerons votre signalement et prendrons les mesures appropriées.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onReport(bloopId)}>
                                    Signaler
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
