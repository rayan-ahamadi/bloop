import { Skeleton } from "@/components/ui/skeleton";


export default function PostDetailLoading() {
    return (
        <div className="flex flex-col gap-4 bg-white md:w-[55%]">
            {/* Original Bloop Loading */}
            <div className="bloopscontent flex flex-row gap-4 items-start p-4">
                <Skeleton className="w-[45px] h-[45px] rounded-md" />

                <div className="bloop-user-data flex flex-col gap-2 flex-1">
                    <div className="user flex flex-row items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="bloop-content flex flex-col gap-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-48 w-full rounded-md" />
                    </div>
                </div>

                <Skeleton className="w-6 h-6" />
            </div>

            {/* Stats buttons loading */}
            <div className="bloopsstatsbuttons flex flex-row items-center justify-start gap-4 border-y-1 p-4 border-secondary-dark">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
            </div>

            {/* Action buttons loading */}
            <div className="bloopsstats flex flex-row items-center justify-center w-full border-secondary-dark p-4">
                <div className="stats-container border-2 border-secondary-dark bg-primary rounded-md shadow-[4px_4px_0_0_black] w-[93%] m-auto flex flex-row justify-around items-center gap-6 p-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-8" />
                </div>
            </div>

            {/* Reply form loading */}
            <div className="replyForm p-4 border-y-1 border-secondary-dark">
                <div className="flex flex-row gap-2 items-start justify-left w-full">
                    <Skeleton className="w-[45px] h-[45px] rounded-md" />
                    <Skeleton className="h-20 w-full rounded-md" />
                </div>
                <div className="flex flex-row justify-between w-full items-center mt-2">
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            </div>

            {/* Replies section loading */}
            <div className="replies-section flex flex-col gap-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="ancestor-bloop flex flex-col bg-secondary p-4 w-full">
                        <div className="bloopscontent flex flex-row gap-4 items-start">
                            <Skeleton className="w-[45px] h-[45px] rounded-md" />

                            <div className="bloop-user-data flex flex-col gap-2 flex-1">
                                <div className="user flex flex-row items-center gap-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                                <div className="bloop-content flex flex-col gap-2">
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>

                            <Skeleton className="w-6 h-6" />
                        </div>
                        <div className="bloopsstats flex flex-row items-center justify-end mt-2">
                            <div className="stats-container border-2 border-secondary-dark bg-primary rounded-md shadow-[4px_4px_0_0_black] flex flex-row items-center gap-6 p-2">
                                <Skeleton className="h-5 w-10" />
                                <Skeleton className="h-5 w-10" />
                                <Skeleton className="h-5 w-10" />
                                <Skeleton className="h-5 w-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}