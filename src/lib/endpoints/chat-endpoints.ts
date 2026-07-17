import { api } from "../api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface DocumentChatPayload {
  message: string;
  documentId: string;
  analysisRequestId?: string;
  history?: ChatMessage[];
}

export async function sendChatMessage(
  payload: DocumentChatPayload,
): Promise<{ reply: string }> {
  const { data } = await api.post<{ reply: string }>(
    "/chat/document",
    payload,
  );
  return data;
}
