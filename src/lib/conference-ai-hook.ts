import {
  fetchServerSentEvents,
  useChat,
  createChatClientOptions,
} from '@tanstack/ai-react'

export const useConferenceChat = (
  threadId = 'learning-ai-tutor',
  initialMessages?: ConferenceChatMessages,
) => {
  const chatOptions = createChatClientOptions({
    threadId,
    ...(initialMessages?.length ? { initialMessages: [...initialMessages] } : {}),
    connection: fetchServerSentEvents('/api/remy-chat'),
  })

  return useChat(chatOptions)
}

export type ConferenceChatMessages = ReturnType<
  typeof useChat
>['messages']
