<script lang="ts">
    import { Search } from "@lucide/svelte";
    import MovieCard from "./MovieCard.svelte";
    import { InfiniteLoader, LoaderState } from "svelte-infinite";
    import { untrack } from "svelte";

    interface Movie {
        id: string;
        title: string;
        year: number;
        type: string | null;
        group_title: string;
        tvg_logo: string | null;
        user_agent: string;
        created_at: string;
        updated_at: string;
    }

    interface SortOption {
        label: string;
        value: string;
    }

    const loaderState = new LoaderState();
    const limit = 100;

    let movies = $state<Movie[]>([]);
    let totalMovies = $state<number>(0);
    let searchTerm: string = $state("");
    let selectedSort: string = $state("title_asc");
    let page = $state<number>(1);
    let isLoading = $state<boolean>(false);

    let sortOptions: SortOption[] = [
        { label: "Title (A-Z)", value: "title_asc" },
        { label: "Title (Z-A)", value: "title_desc" },
        { label: "Year (Newest)", value: "year_desc" },
        { label: "Year (Oldest)", value: "year_asc" },
    ];

    async function loadMore() {
        const sortBy = selectedSort.split("_")[0];
        const sortDirection = selectedSort.split("_")[1];

        try {
            isLoading = true;

            const response = await fetch(
                `https://iptv-be.1001api.com/api/v1/vod/list?limit=${limit}&page=${page}&q=${searchTerm}&order_by=${sortBy}&order_dir=${sortDirection}`,
            );
            const data = await response.json();

            if (page === 1) {
                movies = data.data;
            } else {
                movies = [...movies, ...data.data];
            }

            totalMovies = data.meta.total;

            if (movies.length >= totalMovies || data.data.length === 0) {
                loaderState.complete();
            } else {
                loaderState.loaded();
                page++;
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            loaderState.error();
        } finally {
            isLoading = false;
        }
    }

    async function resetAndLoad() {
        page = 1;
        movies = [];
        loaderState.reset();
        await loadMore();
    }

    function debounce(func: Function, delay: number) {
        let timeoutId: NodeJS.Timeout;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Create debounced version of resetAndLoad
    const debouncedResetAndLoad = debounce(resetAndLoad, 300);

    $effect(() => {
        // Track only the dependencies we care about
        searchTerm;
        selectedSort;

        // Execute the reset and load without tracking state changes inside
        untrack(() => {
            debouncedResetAndLoad();
        });
    });
</script>

<!-- Background Layer -->
<div class="relative min-h-screen bg-slate-950 text-white overflow-hidden">
    <div
        class="absolute inset-0 z-0 scale-110"
        style="
        background-image:
            radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
        background-size: 20px 20px;
        background-color: #0f172a;
    "
    ></div>

    <!-- Main Content -->
    <div class="relative z-10">
        <!-- Filter Bar -->
        <div
            class="bg-white/5 backdrop-blur-md fixed top-0 left-0 right-0 z-20 border-b border-white/10 shadow-md"
        >
            <div
                class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 py-4 flex flex-row gap-1 sm:gap-3 items-center"
            >
                <!-- Search -->
                <div class="relative flex-1 w-full">
                    <Search
                        size={20}
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        bind:value={searchTerm}
                        placeholder={`Search ${totalMovies.toLocaleString("id-ID")} titles...`}
                        class="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    />
                </div>

                <!-- Sort -->
                <select
                    bind:value={selectedSort}
                    class="bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 transition-all"
                >
                    {#each sortOptions as o}
                        <option value={o.value}>{o.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        {#snippet noResults()}
            <div></div>
        {/snippet}

        {#snippet loading()}
            <div class="text-center py-20 text-slate-400 text-lg font-medium">
                Loading movies...
            </div>
        {/snippet}

        <!-- Movies Grid -->
        <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12 pt-32">
            {#if movies.length > 0}
                <InfiniteLoader
                    {loaderState}
                    triggerLoad={loadMore}
                    noData={noResults}
                    error={noResults}
                    {loading}
                    {noResults}
                >
                    <div
                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {#each movies as movie (movie.id)}
                            <MovieCard
                                movie={{
                                    id: movie.id,
                                    title: movie.title,
                                    imageUrl: movie.tvg_logo,
                                    year:
                                        movie.year && movie.year !== 0
                                            ? movie.year
                                            : null,
                                    group: movie.group_title,
                                    createdAt: movie.created_at,
                                }}
                                class="rounded-xl shadow-xl shadow-black/40 hover:shadow-cyan-500/30 transition-transform duration-500 hover:scale-105"
                            />
                        {/each}
                    </div>
                </InfiniteLoader>
            {:else if isLoading}
                <div
                    class="text-center py-20 text-slate-400 text-lg font-medium"
                >
                    Loading movies...
                </div>
            {:else}
                <div
                    class="text-center py-20 text-slate-400 text-lg font-medium"
                >
                    No movies found.
                </div>
            {/if}
        </div>
    </div>
</div>