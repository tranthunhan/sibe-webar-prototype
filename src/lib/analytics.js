import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDev = import.meta.env.DEV;
const tableName = "glowguide_events";
const eventsKey = "gg_events";

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

let sessionStart = Date.now();
let context = { sessionId: "pending", variant: "a" };

export function configureAnalytics({ sessionId, variant = "a" }) {
  context = { sessionId, variant };
  sessionStart = Date.now();
}

export function getElapsedMs() {
  return Date.now() - sessionStart;
}

function queueEvent(event) {
  try {
    const existing = JSON.parse(localStorage.getItem(eventsKey) || "[]");
    existing.push(event);
    localStorage.setItem(eventsKey, JSON.stringify(existing));
  } catch {
    // localStorage unavailable — silently skip
  }
}

// Synchronous: queues to localStorage immediately, fires Supabase as background promise.
export function logEvent(eventName, payload = {}) {
  const event = {
    session_id: context.sessionId,
    variant: context.variant,
    event_name: eventName,
    timestamp: new Date().toISOString(),
    elapsed_ms: getElapsedMs(),
    payload,
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight
  };

  queueEvent(event);

  if (!supabase) {
    if (isDev) console.info("[glowguide analytics]", event);
    return event;
  }

  supabase
    .from(tableName)
    .insert(event)
    .then(({ error }) => {
      if (error && isDev) console.warn("[glowguide analytics insert failed]", error.message);
    })
    .catch((err) => {
      if (isDev) console.warn("[glowguide analytics error]", err);
    });

  return event;
}
