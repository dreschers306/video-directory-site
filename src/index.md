---
title: "Video Directory"
layout: "base.njk" 
---

{# Remove the previous welcome text if you want, or keep it above the grid #}

{# Container for our video grid #}
<div class="video-grid">

  {# Loop through each video in our 'video' collection #}
  {%- for video in collections.video | reverse -%} {# 'reverse' shows newest first based on file creation/git history initially #}

    <article class="video-item" data-date="{{ video.data.dateAdded }}"> {# Add date for potential JS sorting later #}
      <a href="{{ video.url }}"> {# Link to the video's future detail page #}
        <div class="thumbnail-container">
          {# Display the thumbnail image #}
          <img 
            src="{{ video.data.bunnyThumbnailUrl }}" 
            alt="Thumbnail for video {{ video.data.videoId }}" 
            loading="lazy" {# Improve performance #}
            width="320" {# Add dimensions for better layout stability #}
            height="180"> 

          {# Include the hidden preview video - styling will hide it initially #}
          <video 
            src="{{ video.data.bunnyPreviewVideoUrl }}" 
            class="video-preview" 
            loop 
            muted 
            playsinline 
            preload="none"> {# Preload none initially for performance #}
          </video>
        </div>

        {# Display the Video ID #}
        <p class="video-id-title">{{ video.data.videoId }}</p> 
      </a>
      {# We can add tags here later if desired #}
    </article>

  {%- else -%}
    {# Optional: Message if no videos exist yet #}
    <p>No videos found.</p>
  {%- endfor -%}

</div>