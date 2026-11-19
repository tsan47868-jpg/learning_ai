import {
  fetchServerSentEvents,
  useChat,
  createChatClientOptions,
} from '@tanstack/ai-react'

export const useTutorChat = (
  threadId = 'learning-ai-tutor',
  initialMessages?: TutorChatMessages,
) => {
  const chatOptions = createChatClientOptions({
    threadId,
    ...(initialMessages?.length ? { initialMessages: [...initialMessages] } : {}),
    connection: fetchServerSentEvents('/api/remy-chat'),
  })

  return useChat(chatOptions)
}

export type TutorChatMessages = ReturnType<typeof useChat>['messages']
