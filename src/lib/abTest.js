import { nanoid } from "nanoid";

const CONDITION_KEY = "sibe_condition";
const SESSION_KEY = "sibe_session_id";
const allowedConditions = ["control", "phygital"];

// Academic mapping:
// [CO] Persistent assignment removes the need for participants to remember condition state.
// [DF] Query-param override keeps researcher setup simple while default randomization is automatic.
// [ED] Stable sessions avoid disruptive condition flips on reload.
// [PR] Balanced assignment supports comparison of traditional and phygital receptivity.
export function getSessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = nanoid(12);
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

export function assignCondition() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("condition");

  if (allowedConditions.includes(requested)) {
    localStorage.setItem(CONDITION_KEY, requested);
    return { condition: requested, source: "query" };
  }

  const persisted = localStorage.getItem(CONDITION_KEY);
  if (allowedConditions.includes(persisted)) {
    return { condition: persisted, source: "localStorage" };
  }

  const randomCondition = Math.random() < 0.5 ? "control" : "phygital";
  localStorage.setItem(CONDITION_KEY, randomCondition);
  return { condition: randomCondition, source: "random" };
}
