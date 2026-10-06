/* Toy retrieval in a 2-D "embedding" plane: rank chunks by distance to the
   query, turn distance into a similarity score, and refuse to answer when
   even the best match is too far away (the grounding guard). */

export const similarity = (d, scale) => Math.max(0, 1 - d / scale);

export function topK(chunks, query, k, scale = 1) {
  return chunks
    .map((c) => {
      const d = Math.hypot(c.x - query.x, c.y - query.y);
      return { ...c, distance: d, score: similarity(d, scale) };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, Math.max(0, k));
}

/* Grounded = the best hit clears the threshold. */
export function isGrounded(hits, threshold) {
  return hits.length > 0 && hits[0].score >= threshold;
}
