export type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const PREFIX = "planify:chat:";

export function loadChatHistory(userId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PREFIX}${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(userId: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}${userId}`, JSON.stringify(messages.slice(-80)));
}

export function clearChatHistory(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${PREFIX}${userId}`);
}
