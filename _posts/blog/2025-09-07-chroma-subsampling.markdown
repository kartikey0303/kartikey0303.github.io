---
layout: post
title: Understanding Chroma Subsampling
description: Chroma Subsampling animation
sitemap: true
category: blog
tags: [website, jekyll]
last_modified_at: 2025-09-07
excerpt_separator: <!--more-->
---

{% raw %}
<style>
  #yuv-demo .grid {
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 16px;
    align-items: center;
  }

  #yuv-demo canvas {
    image-rendering: pixelated;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
    border: 1px solid rgba(0, 0, 0, .08);
    position: relative;
    background: #fff;
  }

  #yuv-demo .panel {
    padding: 10px 12px;
    border: 1px solid rgba(0, 0, 0, .08);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
  }

  #yuv-demo .title {
    font-weight: 700;
    font-size: 13px;
  }

  #yuv-demo .row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  #yuv-demo .bar {
    height: 6px;
    background: linear-gradient(90deg, #e5e7eb, #d1d5db);
    border-radius: 999px;
    overflow: hidden;
  }

  #yuv-demo .progress {
    height: 100%;
    background: linear-gradient(90deg, #60a5fa, #22c55e);
  }

  #yuv-demo .memory {
    margin-top: 6px;
    font-size: 12px;
  }

  #yuv-demo .calc-panel {
    max-height: 700px;
    overflow-y: auto;
    margin-top: 12px;
    font-size: 12px;
    background: #f9fafb;
    border: 1px solid rgba(0, 0, 0, .08);
    border-radius: 8px;
    padding: 8px;
    white-space: pre-line;
  }

  #yuv-demo .calc-panel b {
    color: #2563eb;
  }
</style>
{% endraw %}

<div id="yuv-demo"
  style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.35;">

  <div class="panel" style="margin-bottom:12px;">
    <div class="row" style="justify-content: space-between;">
      <div class="row">
        <button id="playPause">Play</button>
        <button id="step">Step</button>
        <button id="resetCanvas">Reset</button>
      </div>
      <div class="row">
        <span class="label">Speed</span>
        <input id="speed" type="range" min="10" max="600" value="120" />
        <span class="pill" id="speedMs">120 ms/pixel</span>
      </div>
      <div class="row">
        <label><input type="checkbox" id="showBounds" checked> Show boundaries</label>
        <label><input type="checkbox" id="showCalcs" checked> Show calculations</label>
      </div>
    </div>
    <div class="bar" style="margin-top:10px;">
      <div class="progress" id="progress" style="width:0%"></div>
    </div>
    <div class="memory" id="memoryStats"></div>
  </div>

  <div id="yuv-demo-container" style="display:flex; gap:24px; font-family:Inter,sans-serif;">
    <div class="grid">
      <div>
        <div class="title">RGB</div><canvas id="src"></canvas>
      </div>
      <div>
        <div class="title">R</div><canvas id="chanR"></canvas>
      </div>
      <div>
        <div class="title">G</div><canvas id="chanG"></canvas>
      </div>
      <div>
        <div class="title">B</div><canvas id="chanB"></canvas>
      </div>
      <div>
        <div class="title">Difference</div><canvas id="diff"></canvas>
      </div>

      <div>
        <div class="title">Y (orig)</div><canvas id="chanY"></canvas>
      </div>
      <div>
        <div class="title">U (orig)</div><canvas id="chanU"></canvas>
      </div>
      <div>
        <div class="title">V (orig)</div><canvas id="chanV"></canvas>
      </div>
      <div>
        <div class="title">YUV 4:4:4 → RGB</div><canvas id="rgb444"></canvas>
      </div>
      <div>
        <div class="title">Diff vs Orig</div><canvas id="diff444"></canvas>
      </div>

      <div>
        <div class="title">Y (4:2:2)</div><canvas id="y422"></canvas>
      </div>
      <div>
        <div class="title">U (4:2:2)</div><canvas id="u422"></canvas>
      </div>
      <div>
        <div class="title">V (4:2:2)</div><canvas id="v422"></canvas>
      </div>
      <div>
        <div class="title">YUV 4:2:2 → RGB</div><canvas id="rgb422"></canvas>
      </div>
      <div>
        <div class="title">Diff vs Orig</div><canvas id="diff422"></canvas>
      </div>

      <div>
        <div class="title">Y (4:2:0)</div><canvas id="y420"></canvas>
      </div>
      <div>
        <div class="title">U (4:2:0)</div><canvas id="u420"></canvas>
      </div>
      <div>
        <div class="title">V (4:2:0)</div><canvas id="v420"></canvas>
      </div>
      <div>
        <div class="title">YUV 4:2:0 → RGB</div><canvas id="rgb420"></canvas>
      </div>
      <div>
        <div class="title">Diff vs Orig</div><canvas id="diff420"></canvas>
      </div>
    </div>
    <div id="calc-panel"
      style="flex:1.5; min-width:350px; max-width:600px; background:#f9f9f9; border:1px solid #ccc; border-radius:8px; padding:12px; overflow:auto; resize:horizontal;">
      <div id="calcPanel" class="calc-panel"></div>
    </div>
  </div>
</div>

<div id="yuv-explainer" style="font-family: Inter, sans-serif; line-height:1.6; max-width: 720px;">
  <h2>How RGB ↔ YUV Conversion Works</h2>

  <details open>
    <summary><strong>Step 1: RGB → YUV</strong></summary>
    <p>For each pixel <code>(r, g, b)</code>:</p>
    <pre>
      Y = 0.299r + 0.587g + 0.114b
      U = -0.169r - 0.331g + 0.500b + 128
      V =  0.500r - 0.419g - 0.081b + 128
  </pre>
    <p>So every pixel gets its own <strong>Y</strong>, <strong>U</strong>, and <strong>V</strong> values.</p>
  </details>

  <details>
    <summary><strong>Step 2: YUV 4:4:4</strong></summary>
    <p>Here, <em>all</em> pixels keep their individual Y, U, V values.
      When converting back, you get the same RGB values — no quality loss.</p>
  </details>

  <details>
    <summary><strong>Step 3: YUV 4:2:2 (horizontal subsampling)</strong></summary>
    <p>
      Instead of storing U and V for every pixel, we share them between <em>two
        horizontal neighbors</em>.
    </p>
    <pre>
      U₄₂₂ = (U₀ + U₁) / 2
      V₄₂₂ = (V₀ + V₁) / 2
  </pre>
    <p>Each pixel still has its own Y, but both share the same U, V values → horizontal chroma detail is reduced.</p>
  </details>

  <details>
    <summary><strong>Step 4: YUV 4:2:0 (horizontal + vertical subsampling)</strong></summary>
    <p>
      Now we average U and V across a <strong>2×2 block</strong> of pixels:
    </p>
    <pre>
      U₄₂₀ = (U₀₀ + U₀₁ + U₁₀ + U₁₁) / 4
      V₄₂₀ = (V₀₀ + V₀₁ + V₁₀ + V₁₁) / 4
  </pre>
    <p>Each pixel in the block keeps its own Y, but they all share the same U, V →
      both horizontal and vertical chroma detail are reduced.</p>
  </details>

  <details>
    <summary><strong>Step 5: YUV → RGB</strong></summary>
    <p>When reconstructing, we combine each pixel’s Y with the shared U, V:</p>
    <pre>
      R = Y + 1.402 (V - 128)
      G = Y - 0.344136 (U - 128) - 0.714136 (V - 128)
      B = Y + 1.772 (U - 128)
  </pre>
    <p>This gives the final RGB value used to draw the pixel.</p>
  </details>

</div>

<!-- Add external JS file for the demo -->
<script src="/assets/js/chroma-subsampling.js"></script>