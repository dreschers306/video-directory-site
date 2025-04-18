---
title: "My Awesome Video Directory"
layout: "base.njk" 
---

# Welcome!

This is the homepage for the video directory site.

## Video List Test (from Folder Collection):

<ul>
{%- for video in collections.video | reverse -%} {# Use collections.video now #}
  <li>{{ video.data.videoId }}</li> {# Access data via video.data #}
{%- endfor -%}
</ul>