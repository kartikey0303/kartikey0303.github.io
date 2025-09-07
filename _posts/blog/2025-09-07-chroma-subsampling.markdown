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


{% raw %}
<script>
  (function () {
    const N = 8, SCALE = 20, W = N * SCALE, H = N * SCALE;
    const el = id => document.getElementById(id);
    const ids = ["src", "chanR", "chanG", "chanB", "chanY", "chanU", "chanV", "rgb444", "rgb422", "rgb420", "u422", "v422", "y422", "u420", "v420", "y420", "diff", "diff444", "diff422", "diff420"];
    const ctx = {}; ids.forEach(id => { const c = el(id); c.width = W; c.height = H; ctx[id] = c.getContext("2d"); });

    const playBtn = el("playPause"), stepBtn = el("step"), resetBtn = el("resetCanvas"),
      speedR = el("speed"), speedMs = el("speedMs"), progress = el("progress"), memoryStats = el("memoryStats"),
      showBoundsEl = el("showBounds"), showCalcsEl = el("showCalcs"), calcPanel = el("calcPanel");

    const clamp = (v, l, h) => Math.max(l, Math.min(h, v));
    const toYUV = (r, g, b) => {
      const Y = 0.299 * r + 0.587 * g + 0.114 * b;
      const U = -0.169 * r - 0.331 * g + 0.5 * b + 128;
      const V = 0.5 * r - 0.419 * g - 0.081 * b + 128;
      return [Y, U, V];
    };
    const toRGB = (Y, U, V) => {
      const r = Y + 1.402 * (V - 128);
      const g = Y - 0.344136 * (U - 128) - 0.714136 * (V - 128);
      const b = Y + 1.772 * (U - 128);
      return [clamp(Math.round(r), 0, 255), clamp(Math.round(g), 0, 255), clamp(Math.round(b), 0, 255)];
    };
    const draw = (c, x, y, r, g, b) => { ctx[c].fillStyle = `rgb(${r},${g},${b})`; ctx[c].fillRect(x * SCALE, y * SCALE, SCALE, SCALE); };

    const src = new Array(N * N).fill(0).map((_, i) => {
      const x = i % N, y = (i / N) | 0;
      let r = 32 + 223 * x / (N - 1), g = 32 + 223 * y / (N - 1), b = 32 + 223 * (x + y) / (2 * (N - 1));
      if (((x ^ y) & 1) === 1) { r = Math.min(255, r + 30); b = Math.max(0, b - 30); }
      return [Math.round(r), Math.round(g), Math.round(b)];
    });
    src.forEach((rgb, i) => { const x = i % N, y = (i / N) | 0; draw("src", x, y, ...rgb); draw("chanR", x, y, rgb[0], 0, 0); draw("chanG", x, y, 0, rgb[1], 0); draw("chanB", x, y, 0, 0, rgb[2]); });

    const Y = new Float32Array(N * N).fill(NaN), U = new Float32Array(N * N).fill(NaN), V = new Float32Array(N * N).fill(NaN);
    let order = [...Array(N * N).keys()], cursor = 0, done = 0, delay = +speedR.value, timer = null;

    function update() { progress.style.width = `${(done / (N * N)) * 100}%`; updateMemory(); }
    function updateMemory() {
      const rgbBytes = N * N * 3, yuv444 = N * N * 3, yuv422 = N * N * 2, yuv420 = N * N * 1.5;
      memoryStats.textContent = `RGB: ${rgbBytes}B | YUV444: ${yuv444}B | YUV422: ${yuv422}B | YUV420: ${yuv420}B`;
    }
    function highlightBlock(ctxCanvas, x, y, w, h) { if (!showBoundsEl.checked) return; ctxCanvas.strokeStyle = "red"; ctxCanvas.lineWidth = 2; ctxCanvas.strokeRect(x * SCALE + 1, y * SCALE + 1, w * SCALE - 2, h * SCALE - 2); }
    function drawDiff(diffCanvas, x, y, r1, g1, b1, r2, g2, b2) { const dr = Math.abs(r1 - r2)*5, dg = Math.abs(g1 - g2)*5, db = Math.abs(b1 - b2)*5; const d = (dr + dg + db) / 3; ctx[diffCanvas].fillStyle = `rgb(${d},${d},${d})`; ctx[diffCanvas].fillRect(x * SCALE, y * SCALE, SCALE, SCALE); }
    function logCalc(text) { if (!showCalcsEl.checked) return; calcPanel.textContent = text + "\n\n" + calcPanel.textContent; }

    function step() {
      if (cursor >= order.length) { pause(); return; }
      const i = order[cursor++], x = i % N, y = (i / N) | 0;
      const [r, g, b] = src[i];
      const [yY, yU, yV] = toYUV(r, g, b); Y[i] = yY; U[i] = yU; V[i] = yV;
      done++; update();

      draw("chanY", x, y, yY, yY, yY); draw("chanU", x, y, yU, yU, yU); draw("chanV", x, y, yV, yV, yV);
      const [r444, g444, b444] = toRGB(yY, yU, yV);
      draw("rgb444", x, y, r444, g444, b444); drawDiff("diff444", x, y, r, g, b, r444, g444, b444);

      logCalc(`Pixel (${x},${y})\nRGB=(${r},${g},${b})\nY=0.299*R+0.587*G+0.114*B=${yY.toFixed(2)}\nU=-0.169*R-0.331*G+0.5*B+128=${yU.toFixed(2)}\nV=0.5*R-0.419*G-0.081*B+128=${yV.toFixed(2)}\n→ Reconstructed RGB=(${r444},${g444},${b444})`);

      highlightBlock(ctx["chanY"], x, y, 1, 1); highlightBlock(ctx["chanU"], x, y, 1, 1); highlightBlock(ctx["chanV"], x, y, 1, 1);

      // 4:2:2 subsampling
      const x0 = x & ~1; const idxs = [y * N + x0, y * N + Math.min(x0 + 1, N - 1)];
      const us = [], vs = []; idxs.forEach(ii => { if (!Number.isNaN(U[ii])) { us.push(U[ii]); vs.push(V[ii]); } });
      if (us.length) {
        const u = us.reduce((a, b) => a + b) / us.length, v = vs.reduce((a, b) => a + b) / vs.length;
        idxs.forEach(ii => { if (!Number.isNaN(Y[ii])) { draw("y422", ii % N, (ii / N) | 0, Y[ii], Y[ii], Y[ii]); const [rr, gg, bb] = toRGB(Y[ii], u, v); draw("rgb422", ii % N, (ii / N) | 0, rr, gg, bb); draw("u422", ii % N, (ii / N) | 0, u, u, u); draw("v422", ii % N, (ii / N) | 0, v, v, v); drawDiff("diff422", ii % N, (ii / N) | 0, src[ii][0], src[ii][1], src[ii][2], rr, gg, bb); } });
        highlightBlock(ctx["y422"], x0, y, 2, 1); highlightBlock(ctx["u422"], x0, y, 2, 1); highlightBlock(ctx["v422"], x0, y, 2, 1);
      }

      // 4:2:0 subsampling
      const xB = x & ~1, yB = y & ~1;
      const idxs2 = [yB * N + xB, yB * N + Math.min(xB + 1, N - 1), Math.min(yB + 1, N - 1) * N + xB, Math.min(yB + 1, N - 1) * N + Math.min(xB + 1, N - 1)];
      const us2 = [], vs2 = []; idxs2.forEach(ii => { if (!Number.isNaN(U[ii])) { us2.push(U[ii]); vs2.push(V[ii]); } });
      if (us2.length) {
        const u = us2.reduce((a, b) => a + b) / us2.length, v = vs2.reduce((a, b) => a + b) / vs2.length;
        idxs2.forEach(ii => { if (!Number.isNaN(Y[ii])) { draw("y420", ii % N, (ii / N) | 0, Y[ii], Y[ii], Y[ii]); const [rr, gg, bb] = toRGB(Y[ii], u, v); draw("rgb420", ii % N, (ii / N) | 0, rr, gg, bb); draw("u420", ii % N, (ii / N) | 0, u, u, u); draw("v420", ii % N, (ii / N) | 0, v, v, v); drawDiff("diff420", ii % N, (ii / N) | 0, src[ii][0], src[ii][1], src[ii][2], rr, gg, bb); } });
        highlightBlock(ctx["y420"], xB, yB, 2, 2); highlightBlock(ctx["u420"], xB, yB, 2, 2); highlightBlock(ctx["v420"], xB, yB, 2, 2);
      }
    }

    function play() { if (!timer) { timer = setInterval(step, delay); playBtn.textContent = "Pause"; } }
    function pause() { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = "Play"; } }
    function resetCanvas() {
      pause(); ids.forEach(id => { ctx[id].clearRect(0, 0, W, H); });
      src.forEach((rgb, i) => { const x = i % N, y = (i / N) | 0; draw("src", x, y, ...rgb); draw("chanR", x, y, rgb[0], 0, 0); draw("chanG", x, y, 0, rgb[1], 0); draw("chanB", x, y, 0, 0, rgb[2]); });
      Y.fill(NaN); U.fill(NaN); V.fill(NaN); cursor = 0; done = 0; update(); calcPanel.textContent = "";
    }

    playBtn.onclick = () => timer ? pause() : play();
    stepBtn.onclick = step;
    resetBtn.onclick = resetCanvas;
    speedR.oninput = () => { delay = +speedR.value; speedMs.textContent = `${delay} ms/pixel`; if (timer) { pause(); play(); } };
    resetCanvas();
  })();
</script>
{% endraw %}