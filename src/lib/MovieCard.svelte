<script lang="ts">
    interface CardMovie {
        id: string;
        title: string;
        imageUrl: string;
        year: number | null;
        group: string;
        createdAt: string;
    }

    let props = $props();
    let movie: CardMovie = props.movie;
</script>

<div
    class="relative bg-slate-900 rounded-2xl overflow-hidden group shadow-xl shadow-black/40 transition-transform duration-500 hover:scale-105"
>
    <a href={`/#/vod/${movie.id}`} aria-label={`View details for ${movie.title}`}>
        <!-- Poster -->
        <img
            src={movie.imageUrl}
            alt={`Poster for ${movie.title}`}
            class="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
        />

        <!-- Cinematic Gradient Overlay -->
        <div
            class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"
        ></div>

        <!-- Text Info -->
        <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3
                class="text-lg font-bold drop-shadow-sm group-hover:text-cyan-400 transition-colors"
            >
                {movie.title}
            </h3>
            <p class="text-sm text-slate-300">
                {movie.year ?? "Unknown Year"} · {movie.group}
            </p>
        </div>
    </a>
</div>