import { useState, useCallback } from "react";
import { sendChatMessage, type ChatMessage } from "@/lib/endpoints/chat-endpoints";

export interface UseChatOptions {
  documentId: string;
  analysisRequestId?: string;
}

export function useChat({ documentId, analysisRequestId }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: text.trim() };

      // Optimistically add user message
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const { reply } = await sendChatMessage({
          message: text.trim(),
          documentId,
          analysisRequestId,
          // Send full history for context (excluding the message we just added)
          history: messages,
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply },
        ]);
      } catch (err) {
        const msg =
          (err as any)?.response?.data?.message ??
          (err as Error)?.message ??
          "Something went wrong. Please try again.";
        setError(msg);
        // Remove the optimistic user message on failure
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [documentId, analysisRequestId, messages, isLoading],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
