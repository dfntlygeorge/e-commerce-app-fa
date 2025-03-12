// lib/shopping-assistant.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          role: "assistant",
          content:
            "Welcome to Cat Stealth & Military Equipment! How can I help you find the purr-fect tactical gear for your feline operative today?",
        },
      ],
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () =>
        set((state) => ({
          messages: state.messages.slice(0, 1), // keep only the first message
        })),
    }),
    {
      name: "shopping-assistant-chat",
    },
  ),
);

// Auto-clear messages after 10 minutes
setTimeout(
  () => {
    useChatStore.getState().clearMessages();
  },
  10 * 60 * 1000,
);

export default useChatStore;
