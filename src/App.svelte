<script lang="ts">
  import cv from "../cv.yaml";
  import { Link, UnorderedList, ListItem } from "carbon-components-svelte";
  import Marked from "marked";

  function checkEnabled(object) {
    return !object.disabled;
  }

  function checkNonEmpty(object) {
    return object.items.filter(checkEnabled).length !== 0;
  }
  import "../node_modules/carbon-components-svelte/css/white.css";
  /* import "../node_modules/carbon-components-svelte/css/g90.css"; */
</script>

<svelte:head>
  <title>{cv.about.name}'s CV</title>
</svelte:head>

<main style="padding:40px;line-height:150%">
  <div style="padding-bottom:20px">
    <h1 style="display:inline;padding-right:20px">{cv.about.name}</h1>
    {#if typeof cv.about.title !== "undefined"}
      <h3 style="display:inline">
        <strong>{cv.about.title}</strong>
      </h3>
    {/if}
  </div>
  {#if typeof cv.about.contact !== "undefined"}
    {#each cv.about.contact.filter ? cv.about.contact.filter(checkEnabled) : [] as contactInfo}
      <div style="display:inline-block;padding-right:10px">
        {contactInfo.label}:
        {#if typeof contactInfo.link !== "undefined"}
          <Link href={contactInfo.link}>{contactInfo.text}</Link>
        {:else}{contactInfo.text}{/if}
      </div>
    {/each}
  {/if}
  <br />
  <div>
    {#each cv.about.lists ? cv.about.lists.filter(checkEnabled) : [] as list}
      <div style="display:inline-block;padding-right:10px">
        <strong>{list.label}:</strong>
        {list.items.join(", ")}.
      </div>
    {/each}
  </div>
  {#if typeof cv.about.summary !== "undefined"}
    <h3 style="padding-top:12px">Summary</h3>
    <hr />
    {cv.about.summary}
    <br />
  {/if}
  {#each cv.sections.filter(checkEnabled).filter(checkNonEmpty) as section}
    <h3 style="padding-top:15px" id={section.title}>{section.title}</h3>
    <hr style="margin-bottom:0px" />
    {#each section.items.filter(checkEnabled) as item}
      <div
        style="padding-top:12px;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between"
      >
        <div style="padding-right:15px">
          <h4 style="display:inline" id={item.title}>{item.title}</h4>
          {#if typeof item.subtitle !== "undefined"}
            <h5 style="display:inline">- {item.subtitle}</h5>
          {/if}
        </div>
        <div style="display:inline-block;text-align:right">
          {#if typeof item.date === "object"}
            {#if typeof item.date.end !== "undefined"}
              <h5>
                {item.date.start}
                <strong>-</strong>
                {item.date.end}
              </h5>
            {:else}
              <h5>
                {item.date.start}
                <strong>-</strong>
                Present
              </h5>
            {/if}
          {:else if typeof item.date !== "undefined"}
            <h5>{item.date}</h5>
          {/if}
        </div>
      </div>
      {#if typeof item.body !== "undefined"}
        <div style="padding-top:6px">{@html Marked(item.body)}</div>
      {/if}
    {/each}
  {/each}
  {#if typeof cv.references !== "undefined"}
    <h3 style="padding-top:12px">References</h3>
    <hr />
    {cv.references}
  {/if}
</main>
