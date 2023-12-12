<script lang="ts">
  import type {Href} from "$lib/database/dbTypes";

  export let initialHrefs: Array<Href> = []

  let hrefs: Array<Href> = []

  $:{
    try {
      hrefs = initialHrefs.toSorted((a, b) => b.amount - a.amount) || []
    }
    catch (e){
      hrefs = []
    }
  }

</script>

<h1>Href list</h1>
<ul>
    {#each hrefs as href (href)}
        <li>
            ({href.amount} times) <a href={href.link}>{href.link}</a>
        </li>
    {/each}
</ul>
