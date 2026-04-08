export default function Loading() {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="w-96 h-12 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
                        <div className="w-64 h-6 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
                    </div>
                    <div className="w-full md:w-[480px] h-16 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-[2rem]"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="h-[500px] bg-gray-200 dark:bg-slate-800 animate-pulse rounded-[2rem]"></div>
                        <div className="h-64 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-[2rem]"></div>
                    </div>
                    <div className="lg:col-span-3 space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-[2.5rem]"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
