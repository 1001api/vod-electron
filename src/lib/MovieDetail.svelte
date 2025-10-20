<script lang="ts">
    import { onMount } from "svelte";
    import "vidstack/bundle";
    import { fade } from "svelte/transition";
    import { pop } from "svelte-spa-router";
    import { ArrowLeft } from "@lucide/svelte";

    let { params } = $props<{ params: { id: string } }>();

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
        urls: string[];
    }

    let movie = $state<Movie | null>(null);

    const fetchMovie = async (id: string) => {
        if (!id) return;
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/vod/detail/${id}`,
        );
        const data = await response.json();

        if (data.data) {
            movie = data.data;
        } else {
            movie = null;
        }
    };

    let currentUrl: string = $state("");
    let isLinkError = $state<boolean>(false);
    let copied = $state<boolean>(false);

    $effect(() => {
        isLinkError = false;
        if (!currentUrl && movie?.urls?.length) {
            currentUrl = movie.urls[0];
        }
    });

    $effect(() => {
        fetchMovie(params.id);
    });

    function handlePlayFail(event: Event) {
        isLinkError = true;
    }

    function copyLink() {
        navigator.clipboard.writeText(currentUrl).then(() => {
            copied = true;
            setTimeout(() => (copied = false), 1500);
        });
    }
</script>

{#if movie}
    <div
        class="relative min-h-screen bg-slate-950 text-white overflow-hidden pb-64 sm:pb-4"
    >
        <button
            onclick={pop}
            class="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Go back"
        >
            <ArrowLeft class="h-4 w-4" />
            <span>Back</span>
        </button>

        <!-- Cinematic Blurred Backdrop -->
        <div
            class="absolute inset-0 z-0 bg-cover bg-center opacity-30 blur-3xl scale-110"
            style="background-image: url({movie.tvg_logo});"
        ></div>
        <div
            class="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"
        ></div>

        <!-- Main Layout -->
        <main
            class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
            <!-- Poster -->
            <div class="lg:col-span-4 flex flex-col gap-8 lg:justify-start">
                <img
                    src={movie.tvg_logo}
                    alt="Poster for {movie.title}"
                    class="rounded-2xl sm:w-72 shadow-2xl shadow-black/40 object-cover aspect-[2/3] transition-transform duration-500 hover:scale-105 hover:shadow-cyan-500/30"
                />

                <!-- Metadata -->
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner"
                >
                    <div>
                        <p class="text-xs uppercase text-slate-400">Title</p>
                        <p class="text-sm text-slate-200">
                            {movie.title}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs uppercase text-slate-400">Year</p>
                        <p class="text-sm text-slate-200">
                            {movie.year}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs uppercase text-slate-400">
                            Total Links
                        </p>
                        <p class="text-sm text-slate-200">
                            {movie.urls.length}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs uppercase text-slate-400">Group</p>
                        <p class="text-sm text-slate-200">
                            {movie.group_title}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs uppercase text-slate-400">
                            Uploaded At
                        </p>
                        <p class="text-sm text-slate-200">
                            {new Date(movie.created_at).toLocaleDateString(
                                "id-ID",
                            )}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase text-slate-400">Type</p>
                        <p class="text-sm text-slate-200">
                            {movie.type ?? "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Details -->
            <div class="lg:col-span-8 space-y-8">
                <!-- Title -->
                <div>
                    <span
                        class="inline-block bg-cyan-500/90 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest shadow-sm"
                    >
                        {movie.group_title}
                    </span>
                    <h1
                        class="text-4xl lg:text-6xl font-black tracking-tight drop-shadow-sm"
                    >
                        {movie.title}
                    </h1>
                    <p class="text-lg text-slate-300 mt-2">
                        {movie.year > 0 ? movie.year : "Unknown Year"}
                    </p>
                </div>

                <!-- Link Selector -->
                <div class="flex flex-wrap gap-3">
                    {#each movie.urls as url, idx}
                        <button
                            class="px-4 py-1 rounded-full border border-cyan-500 text-cyan-400 text-sm hover:bg-cyan-500 hover:text-slate-900 transition-colors
              {currentUrl === url
                                ? 'bg-cyan-500 text-slate-900 font-semibold'
                                : ''}"
                            onclick={() => (currentUrl = url)}
                        >
                            Link {idx + 1}
                        </button>
                    {/each}
                </div>

                {#if isLinkError}
                    <div
                        transition:fade
                        class="flex items-start gap-3 p-3 rounded-md border border-red-600 bg-red-900/30 text-sm"
                    >
                        <!-- Icon -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 text-red-400 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                            />
                        </svg>

                        <div class="flex-1 space-y-1">
                            <p class="text-red-300">
                                Waduh! Sepertinya link-nya nggak jalan. Coba
                                pake link lain.
                            </p>

                            <details class="text-slate-300">
                                <summary
                                    class="cursor-pointer text-cyan-400 hover:underline"
                                >
                                    Kamu bisa coba buka di VLC Media Player
                                </summary>
                                <ol
                                    class="list-decimal list-inside mt-1 space-y-0.5"
                                >
                                    <li>Buka VLC Media Player</li>
                                    <li>
                                        Tekan <kbd
                                            class="px-1 py-0.5 text-xs bg-slate-700 text-slate-200 rounded"
                                            >Ctrl + N</kbd
                                        >
                                    </li>
                                    <li>Tempel link → Next</li>
                                    <li>Tunggu videonya muncul</li>

                                    <br />

                                    <p class="text-red-300 text-xs">
                                        Jika video masih tidak muncul berarti
                                        linknya memang sudah mati, tunggu update
                                        ya!
                                    </p>
                                </ol>
                            </details>
                        </div>

                        <button
                            class={`px-3 py-1 rounded text-slate-900 transition-colors text-xs font-medium ${copied ? "bg-cyan-800 text-slate-900" : "bg-cyan-500"}`}
                            onclick={copyLink}
                        >
                            {copied ? "Tersalin!" : "Salin Link"}
                        </button>
                    </div>
                {/if}

                <!-- Vidstack Player with HLS -->
                <div
                    class="aspect-video w-full rounded-xl overflow-hidden shadow-xl border border-white/10 bg-black/50"
                >
                    <media-player
                        title={movie.title}
                        crossorigin
                        playsinline
                        streamType="on-demand"
                        src={currentUrl}
                        onerror={handlePlayFail}
                    >
                        <media-provider>
                            {#if currentUrl.includes(".mkv") || currentUrl.includes(".mp4")}
                                <source src={currentUrl} type="video/mp4" />
                            {/if}
                            <media-poster src={movie.tvg_logo}></media-poster>
                            <media-captions></media-captions>
                            <media-plyr-layout></media-plyr-layout>
                        </media-provider>
                    </media-player>
                </div>
            </div>
        </main>
    </div>
{:else}
    <div class="flex items-center justify-center min-h-screen bg-slate-950">
        <div class="text-center space-y-4">
            <svg
                class="animate-spin h-10 w-10 text-cyan-400 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
           5.291A7.962 7.962 0 014 12H0c0 3.042 
           1.135 5.824 3 7.938l3-2.647z"
                >
                </path>
            </svg>
            <p class="text-slate-400 text-lg font-medium">
                Loading movie details...
            </p>
        </div>
    </div>
{/if}
