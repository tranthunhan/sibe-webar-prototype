import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const tableName = "sibe_events";

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

let sessionStart = Date.now();
let context = {
  sessionId: "pending",
  condition: "pending"
};

// Academic mapping:
// [CO] A single logging helper standardizes payloads and reduces instrumentation burden.
// [DF] Console fallback prevents analytics setup decisions from blocking participant flow.
// [ED] Non-blocking inserts keep visual feedback responsive during small delight moments.
// [PR] Event groups isolate physical-digital touchpoint behavior for later analysis.
export function configureAnalytics({ sessionId, condition }) {
  context = { sessionId, condition };
  sessionStart = Date.now();
}

export function getElapsedMs() {
  return Date.now() - sessionStart;
}

export async function logEvent(eventName, payload = {}, eventGroup = "study") {
  const event = {
    session_id: context.sessionId,
    condition: context.condition,
    event_name: eventName,
    event_group: eventGroup,
    elapsed_ms: getElapsedMs(),
    payload,
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight
  };

  if (!supabase) {
    console.info("[sibe analytics]", event);
    return event;
  }

  const { error } = await supabase.from(tableName).insert(event);
  if (error) {
    console.warn("[sibe analytics insert failed]", error.message, event);
  }

  return event;
}
