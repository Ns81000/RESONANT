// Audio recording + client-side downsampling to 16kHz mono WAV.

export async function recordAudio(opts: {
  maxSeconds: number;
  onLevel?: (level: number) => void;
  onTick?: (remaining: number) => void;
  signal: { stop: () => void; onStop: (cb: () => void) => void };
}): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
  });

  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const src = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64;
  src.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let rafId = 0;
  const tickLevel = () => {
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    opts.onLevel?.(sum / data.length / 255);
    rafId = requestAnimationFrame(tickLevel);
  };
  rafId = requestAnimationFrame(tickLevel);

  // Pick supported mime
  const mimeCandidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  const mime =
    mimeCandidates.find(
      (m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m),
    ) || "";
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const startedAt = Date.now();
  const stopFlag = { stopped: false };
  const tickTimer = setInterval(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    const remaining = Math.max(0, opts.maxSeconds - elapsed);
    opts.onTick?.(remaining);
    if (remaining <= 0 && !stopFlag.stopped) {
      stopFlag.stopped = true;
      recorder.stop();
    }
  }, 100);

  opts.signal.stop = () => {
    if (!stopFlag.stopped) {
      stopFlag.stopped = true;
      recorder.stop();
    }
  };

  return await new Promise<Blob>((resolve, reject) => {
    recorder.onerror = (e) => reject(e);
    recorder.onstop = async () => {
      clearInterval(tickTimer);
      cancelAnimationFrame(rafId);
      stream.getTracks().forEach((t) => t.stop());
      try {
        const blob = new Blob(chunks, { type: mime || "audio/webm" });
        const wav = await downsampleToWav(blob, ctx, 16000);
        await ctx.close();
        opts.signal.onStop(() => {});
        resolve(wav);
      } catch (err) {
        reject(err);
      }
    };
    recorder.start();
  });
}

async function downsampleToWav(blob: Blob, ctx: AudioContext, targetRate: number): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  let decoded: AudioBuffer;
  try {
    decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
  } catch (err) {
    decoded = await new Promise<AudioBuffer>((resolve, reject) => {
      const p = ctx.decodeAudioData(
        arrayBuffer.slice(0),
        resolve,
        (e) => reject(e || new Error("Failed to decode audio data"))
      );
      if (p && typeof (p as any).catch === "function") {
        (p as any).catch(reject);
      }
    });
  }
  const duration = decoded.duration;
  const offline = new OfflineAudioContext(1, Math.ceil(duration * targetRate), targetRate);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();
  return encodeWav(rendered);
}

function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0);
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buf);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: "audio/wav" });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
