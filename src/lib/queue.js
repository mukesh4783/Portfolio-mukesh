/* Request pipeline simulation for the GramSetu figure.
   Tokens move Submitted → Verified → Approved → Issued; each stage holds
   a token for a random service time. Pure: returns a new state each step. */

export const STAGES = ['Submitted', 'Verified', 'Approved', 'Issued'];
export const KINDS = ['certificate', 'scheme', 'service'];
const SERVICE = [[0.9, 1.8], [1.2, 3.0], [1.4, 3.2], [1.1, 1.1]];
const MAX_TOKENS = 30;

const serviceTime = (stage, rand) => {
  const [lo, hi] = SERVICE[stage];
  return lo + (hi - lo) * rand();
};

export const initialQueue = () => ({ tokens: [], nextId: 0, spawnIn: 0, issued: 0, turnaround: 0 });

export function stepQueue(state, dt, rand) {
  let issued = state.issued;
  let turnaround = state.turnaround;

  const advanced = state.tokens.flatMap((tk) => {
    const age = tk.age + dt;
    const remaining = tk.remaining - dt;
    if (remaining > 0) return [{ ...tk, age, remaining }];
    if (tk.stage < STAGES.length - 1) {
      const stage = tk.stage + 1;
      return [{ ...tk, age, stage, remaining: serviceTime(stage, rand) }];
    }
    issued += 1;
    turnaround += age;
    return [];
  });

  const spawnIn = state.spawnIn - dt;
  const canSpawn = spawnIn <= 0 && advanced.length < MAX_TOKENS;
  const tokens = canSpawn
    ? [...advanced, { id: state.nextId, kind: KINDS[state.nextId % KINDS.length], stage: 0, age: 0, remaining: serviceTime(0, rand) }]
    : advanced;

  return {
    tokens,
    nextId: canSpawn ? state.nextId + 1 : state.nextId,
    spawnIn: canSpawn ? 0.35 + rand() * 0.5 : spawnIn,
    issued,
    turnaround,
  };
}

export const countByStage = (tokens) =>
  STAGES.map((_, s) => tokens.filter((t) => t.stage === s).length);

/* A citizen files a request by hand: one new token of `kind` at stage 0. */
export function raiseRequest(state, kind, rand) {
  if (!KINDS.includes(kind) || state.tokens.length >= MAX_TOKENS) return state;
  const token = { id: state.nextId, kind, stage: 0, age: 0, remaining: serviceTime(0, rand) };
  return { ...state, tokens: [...state.tokens, token], nextId: state.nextId + 1 };
}
