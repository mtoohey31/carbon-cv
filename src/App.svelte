<script lang="ts">
  import type { CV } from "../types/generated/schema-type";
  import cvYAML from "../cv.yaml";
  const cv = cvYAML as CV;
  import Marked from "marked";

  function checkEnabled(object: { disabled?: boolean }) {
    return !object.disabled;
  }
</script>

<svelte:head>
  <title>{cv.about.name}'s CV</title>
</svelte:head>

<div class="pb-4">
  <h1 class="inline">{cv.about.name}</h1>
  {#if typeof cv.about.title !== "undefined"}
    <h2 class="inline pl-6">
      <strong>{cv.about.title}</strong>
    </h2>
  {/if}
</div>
{#if typeof cv.about.contact !== "undefined"}
  {#each cv.about.contact as info}
    <div class="inline-block pr-2 marked">{@html Marked(info)}</div>
  {/each}
{/if}
<div>
  {#each cv.about.lists ? cv.about.lists.filter(checkEnabled) : [] as list}
    <div class="inline-block pr-2">
      <strong>{list.label}:</strong>
      {list.items.join(", ")}
    </div>
  {/each}
</div>
{#if typeof cv.about.summary !== "undefined"}
  <h2>Summary</h2>
  <hr />
  {cv.about.summary}
{/if}
{#each cv.sections.filter((o) => o.items.filter(checkEnabled).length !== 0) as section}
  <h2 id={section.title}>{section.title}</h2>
  <hr />
  {#each section.items.filter(checkEnabled) as item}
    <div class="pt-2 flex flex-wrap justify-between gap-1">
      <h3 class="inline marked" style="margin-bottom: -2px;" id={item.title}>
      {@html Marked(item.title)}
      </h3>
      {#if typeof item.subtitle !== "undefined"}
      <strong class="marked mt-auto">- {@html Marked(item.subtitle)}</strong>
      {/if}
      <div class="flex-grow" />
      <strong class="mt-auto">
        {#if typeof item.date === "object"}
          {#if typeof item.date.end !== "undefined"}
            {item.date.start} - {item.date.end}
          {:else}
            {item.date.start} - Present
          {/if}
        {:else if typeof item.date !== "undefined"}
          {item.date}
        {/if}
      </strong>
    </div>
    {#if typeof item.body !== "undefined"}
      <div class="marked">{@html Marked(item.body)}</div>
    {/if}
  {/each}
{/each}
{#if typeof cv.references !== "undefined"}
  <h3>References</h3>
  <hr />
  {cv.references}
{/if}

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    @apply bg-white m-8 leading-5 text-sm;
  }

  .marked p {
    @apply inline;
  }

  h1 {
    @apply text-5xl font-light;
  }

  h2 {
    @apply text-3xl pt-4;
  }

  h3 {
    @apply text-xl;
  }

  ul {
    @apply list-disc pl-6;
  }

  hr {
    @apply border-gray-300;
    border-width: 1px;
    border-style: inset;
  }

  a {
    @apply text-blue-500;
  }

  a:hover {
    @apply underline;
  }

  strong {
    @apply font-semibold;
  }
</style>
