<script lang="ts">
    import Router from "svelte-spa-router";
    import MovieSection from "./lib/MovieSection.svelte";
    import MovieDetail from "./lib/MovieDetail.svelte";

    const routes = {
        "/": MovieSection,
        "/vod/:id": MovieDetail,
    };
</script>

<main>
    <Router {routes} />
</main>