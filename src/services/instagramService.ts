/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VENKAT SWITCHGEARS — INSTAGRAM LEADS INTEGRATION
 *  Pull DMs, comments, and story replies as leads
 *
 *  How it works:
 *  1. Connect Instagram Business Account → Meta Developer App
 *  2. Subscribe to webhooks: messages, comments, mentions
 *  3. When someone DMs or comments → webhook fires → new lead created
 *  4. Auto-send welcome email + WhatsApp to that person
 *
 *  Instagram Profile: @venkat_switchgears (confirm handle)
 *  Facebook Page: Ms-Venkat-Switchgears
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── CONFIG ────────────────────────────────────────────────────
export const INSTAGRAM_CONFIG = {
  pageId:          process.env.META_PAGE_ID         || "xxxx",
  instagramUserId: process.env.INSTAGRAM_USER_ID    || "xxxx",
  accessToken:     process.env.META_PAGE_ACCESS_TOKEN || "xxxx",
  webhookSecret:   process.env.META_WEBHOOK_SECRET   || "venkat_ig_secret",
  appId:           process.env.META_APP_ID           || "xxxx",
};

const BASE_URL = "https://graph.facebook.com/v18.0";

// ── TYPES ─────────────────────────────────────────────────────

export interface InstagramDM {
  senderId:   string;
  senderName: string;
  message:    string;
  timestamp:  string;
  mediaUrl?:  string;
}

export interface InstagramComment {
  commentId:  string;
  fromName:   string;
  fromId:     string;
  message:    string;
  postId:     string;
  timestamp:  string;
}

// ── API HELPERS ───────────────────────────────────────────────

async function igGet(endpoint: string): Promise<any> {
  const url = `${BASE_URL}/${endpoint}&access_token=${INSTAGRAM_CONFIG.accessToken}`;
  const res = await fetch(url);
  return res.json();
}

async function igPost(endpoint: string, data: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/${endpoint}?access_token=${INSTAGRAM_CONFIG.accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── CONVERSATIONS / DMs ───────────────────────────────────────

/** Fetch all Instagram DM conversations */
export async function fetchDMConversations(): Promise<any[]> {
  const data = await igGet(
    `${INSTAGRAM_CONFIG.instagramUserId}/conversations?fields=id,participants,messages{message,created_time,from}&platform=instagram`
  );
  return data.data || [];
}

/** Reply to an Instagram DM */
export async function replyToDM(recipientId: string, message: string): Promise<any> {
  return igPost(`${INSTAGRAM_CONFIG.pageId}/messages`, {
    recipient: { id: recipientId },
    message: { text: message },
  });
}

/** Get sender profile info (name, profile pic) */
export async function getSenderProfile(userId: string): Promise<{ name: string; profilePic: string }> {
  const data = await igGet(`${userId}?fields=name,profile_pic`);
  return { name: data.name || "Instagram User", profilePic: data.profile_pic || "" };
}

// ── COMMENTS ─────────────────────────────────────────────────

/** Fetch recent comments on all posts */
export async function fetchRecentComments(): Promise<InstagramComment[]> {
  const posts = await igGet(
    `${INSTAGRAM_CONFIG.instagramUserId}/media?fields=id,caption,comments{id,text,from,timestamp}`
  );

  const comments: InstagramComment[] = [];
  for (const post of posts.data || []) {
    for (const comment of post.comments?.data || []) {
      comments.push({
        commentId:  comment.id,
        fromName:   comment.from?.name || "Unknown",
        fromId:     comment.from?.id || "",
        message:    comment.text,
        postId:     post.id,
        timestamp:  comment.timestamp,
      });
    }
  }
  return comments;
}

/** Reply to a comment */
export async function replyToComment(commentId: string, message: string): Promise<any> {
  return igPost(`${commentId}/replies`, { message });
}

// ── WEBHOOK HANDLER ───────────────────────────────────────────

/**
 * Handle incoming Instagram webhook event
 * Called from your backend webhook endpoint: POST /webhooks/instagram
 *
 * Events handled:
 * - messages     → New DM → Create lead
 * - comments     → New comment → Create lead
 * - reactions    → Reaction on post (optional)
 */
export function handleInstagramWebhook(body: any): {
  type: "dm" | "comment" | "unknown";
  lead?: {
    name: string; source: "Instagram"; message: string;
    instagramUserId: string; timestamp: string;
  };
} {
  const entry = body.entry?.[0];
  if (!entry) return { type: "unknown" };

  // DM event
  if (entry.messaging) {
    const msg = entry.messaging[0];
    return {
      type: "dm",
      lead: {
        name:            `Instagram User (${msg.sender?.id})`,
        source:          "Instagram",
        message:         msg.message?.text || "[media/attachment]",
        instagramUserId: msg.sender?.id,
        timestamp:       new Date(msg.timestamp).toISOString(),
      },
    };
  }

  // Comment event
  if (entry.changes?.[0]?.field === "comments") {
    const change = entry.changes[0].value;
    return {
      type: "comment",
      lead: {
        name:            change.from?.name || "Instagram User",
        source:          "Instagram",
        message:         `Comment on post: "${change.text}"`,
        instagramUserId: change.from?.id,
        timestamp:       new Date(change.created_time * 1000).toISOString(),
      },
    };
  }

  return { type: "unknown" };
}

// ── AUTO-REPLY (optional) ─────────────────────────────────────

/** Auto-reply to a DM acknowledging the enquiry */
export async function sendInstagramAutoReply(recipientId: string): Promise<void> {
  const message = `Hi! 👋 Thank you for messaging Venkat Switchgears!

We've received your message and will reply shortly. For urgent requirements:
📞 +91 9448354274
🌐 venkatswitchgears.com

⚡ Venkat Switchgears — Synergizing Power`;

  await replyToDM(recipientId, message);
}

// ── MOCK DATA (for UI preview) ────────────────────────────────

export const mockInstagramLeads = [
  {
    id: "IG-2025-001",
    source: "Instagram" as const,
    type: "DM",
    name: "arun.electrics",
    message: "Hello sir, need LT panel quote for factory. Please send price list.",
    timestamp: "2025-04-16T08:14:00",
    replied: false,
  },
  {
    id: "IG-2025-002",
    source: "Instagram" as const,
    type: "Comment",
    name: "srinivas_constructions",
    message: "What is the price of 630A switchgear panel? Interested for site at HSR Layout",
    timestamp: "2025-04-15T14:30:00",
    replied: true,
  },
  {
    id: "IG-2025-003",
    source: "Instagram" as const,
    type: "DM",
    name: "kumar_infra_blr",
    message: "Do you supply MCC panels? Need 3 nos for warehouse project.",
    timestamp: "2025-04-14T11:20:00",
    replied: true,
  },
];

/**
 * ─────────────────────────────────────────────────────────────
 *  SETUP STEPS
 *  ─────────────────────────────────────────────────────────────
 *  1. Go to: developers.facebook.com → Create App
 *  2. Add products: Messenger + Instagram Graph API + Webhooks
 *  3. Connect your Instagram Business Account to a Facebook Page
 *     (Instagram: Settings → Linked Accounts → Facebook)
 *  4. In App Dashboard → Webhooks → Subscribe to:
 *     - messages (DMs)
 *     - comments
 *     - mentions
 *  5. Set webhook URL: https://your-backend.com/webhooks/instagram
 *  6. Add env vars: META_PAGE_ID, INSTAGRAM_USER_ID, META_PAGE_ACCESS_TOKEN
 *  7. For permanent token: use System User in Business Manager
 *
 *  Important:
 *  - Instagram Business account required (not personal)
 *  - Account must have a Facebook Page linked
 *  - Free API — no cost for reading messages/comments
 * ─────────────────────────────────────────────────────────────
 */
