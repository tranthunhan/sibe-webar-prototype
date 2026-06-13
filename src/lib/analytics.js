import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const tableName = "glowguide_events";

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

let sessionStart = Date.now();
let context = {
  sessionId: "pending",
  channel: "skin_finder"
};

// Academic mapping:
// [CO] A single logging helper standardizes payloads and reduces instrumentation burden.
// [DF] Console fallback prevents analytics setup decisions from blocking participant flow.
// [ED] Non-blocking inserts keep visual feedback responsive during small delight moments.
// [PR] The QR-like scenario supports willingness to use digital product guidance.
export function configureAnalytics({ sessionId, channel = "skin_finder" }) {
  context = { sessionId, channel };
  sessionStart = Date.now();
}

export function getElapsedMs() {
  return Date.now() - sessionStart;
}

export async function logEvent(eventName, payload = {}, eventGroup = "study") {
  const event = {
    session_id: context.sessionId,
    channel: context.channel,
    event_name: eventName,
    event_group: eventGroup,
    elapsed_ms: getElapsedMs(),
    payload,
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight
  };

  if (!supabase) {
    console.info("[glowguide analytics]", event);
    return event;
  }

  const { error } = await supabase.from(tableName).insert(event);
  if (error) {
    console.warn("[glowguide analytics insert failed]", error.message, event);
  }

  return event;
}
