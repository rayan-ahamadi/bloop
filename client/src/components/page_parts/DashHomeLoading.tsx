import { Skeleton } from "@/components/ui/skeleton";


export default function DashHomeLoading() {
    return (
        <div className="flex flex-col items-center md:w-[55%] w-full md:flex-grow-1 overflow-y-scroll h-screen max-h-[93vh] z-50">
            {/* Post Bloop Loading */}
            <div className="w-full hidden md:block sticky top-0 bg-white">
                <div className="inputs flex flex-row items-start gap-2 p-4 border-b-2 border-secondary-dark">
                    <Skeleton className="w-[45px] h-[45px] rounded-md" />
                    <div className="flex flex-col flex-grow">
                        <Skeleton className="w-full h-[80px] mb-2" />
                        <div className="flex flex-row justify-between items-center mt-2">
                            <Skeleton className="w-6 h-6" />
                            <Skeleton className="w-16 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bloops Loading */}
            <div className="bloops w-full md:relative md:-z-50">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="relative block border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
                        <div className="flex flex-col p-4 bg-secondary shadow-md w-full">
                            <div className="bloopscontent flex flex-row gap-4 items-start">
                                <Skeleton className="w-[45px] h-[45px] rounded-md" />

                                <div className="bloop-user-data flex flex-col gap-2 flex-grow">
                                    <div className="user flex flex-row items-center gap-2 w-full">
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-16 h-4" />
                                        <Skeleton className="w-12 h-4" />
                                    </div>
                                    <div className="bloop-content flex flex-col gap-2">
                                        <Skeleton className="w-full h-4 mb-1" />
                                        <Skeleton className="w-3/4 h-4 mb-2" />
                                        {index % 3 === 0 && (
                                            <Skeleton className="w-full h-48 rounded-md" />
                                        )}
                                    </div>
                                </div>

                                <Skeleton className="w-6 h-6" />
                            </div>

                            <div className="bloopsstats flex flex-row items-center justify-end-safe">
                                <div className="stats-container border-2 border-secondary-dark bg-primary rounded-md shadow-[4px_4px_0_0_black] flex flex-row items-center gap-6 p-2 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="w-4 h-4" />
                                        <Skeleton className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="w-4 h-4" />
                                        <Skeleton className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="w-4 h-4" />
                                        <Skeleton className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}