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
