export const getTimeChunks = (data: any[]) => {
  const chunks = [];
  let currentState = data[0].elevation > 0; // Is it up at the start?
  let startIdx = 0;

  for (let i = 1; i < data.length; i++) {
    const state = data[i].elevation > 0;

    // If the state flips (e.g., goes from up to down)
    if (state !== currentState) {
      chunks.push({ start: startIdx, end: i, isUp: currentState });
      startIdx = i; // Start a new chunk
      currentState = state;
    }
  }

  // Push the final chunk
  chunks.push({ start: startIdx, end: data.length, isUp: currentState });

  return chunks;
};
