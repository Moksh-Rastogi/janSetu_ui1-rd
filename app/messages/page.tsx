'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ConversationList, type Conversation } from '@/components/messages/conversation-list'
import { ChatWindow, type Message } from '@/components/messages/chat-window'

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Raj Patel',
    avatar: '',
    lastMessage: 'The relief supplies have been distributed successfully',
    timestamp: '2m ago',
    unreadCount: 3,
    isOnline: true,
    isTyping: false,
  },
  {
    id: '2',
    name: 'Priya Singh',
    avatar: '',
    lastMessage: 'Can you send the volunteer schedule?',
    timestamp: '15m ago',
    unreadCount: 0,
    isOnline: true,
    isTyping: true,
  },
  {
    id: '3',
    name: 'Dr. Amit Kumar',
    avatar: '',
    lastMessage: 'Medical camp setup is complete',
    timestamp: '1h ago',
    unreadCount: 1,
    isOnline: false,
    isTyping: false,
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    avatar: '',
    lastMessage: 'Training session went well today!',
    timestamp: '3h ago',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
  },
  {
    id: '5',
    name: 'Red Cross Team',
    avatar: '',
    lastMessage: 'We need more volunteers for tomorrow',
    timestamp: '5h ago',
    unreadCount: 5,
    isOnline: true,
    isTyping: false,
  },
  {
    id: '6',
    name: 'Vikram Sharma',
    avatar: '',
    lastMessage: 'Survey report attached',
    timestamp: '1d ago',
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: '7',
    name: 'Anita Rao',
    avatar: '',
    lastMessage: 'Shelter capacity has been increased',
    timestamp: '1d ago',
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: '8',
    name: 'NDRF Coordination',
    avatar: '',
    lastMessage: 'Emergency response update shared',
    timestamp: '2d ago',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
  },
]

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      content: 'Hi, how is the relief distribution going?',
      timestamp: '10:30 AM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm2',
      content: 'We have completed distribution in Sector 12. Around 200 families received supplies.',
      timestamp: '10:32 AM',
      senderId: '1',
      status: 'read',
    },
    {
      id: 'm3',
      content: 'That is great progress! Do you need any additional resources?',
      timestamp: '10:35 AM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm4',
      content: 'We could use more water purification tablets and first aid kits.',
      timestamp: '10:38 AM',
      senderId: '1',
      status: 'read',
    },
    {
      id: 'm5',
      content: 'I will coordinate with the logistics team right away.',
      timestamp: '10:40 AM',
      senderId: 'current-user',
      status: 'delivered',
    },
    {
      id: 'm6',
      content: 'The relief supplies have been distributed successfully',
      timestamp: '11:15 AM',
      senderId: '1',
      status: 'read',
      attachment: {
        type: 'image',
        name: 'distribution-photo.jpg',
        url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop',
      },
    },
  ],
  '2': [
    {
      id: 'm1',
      content: 'Good morning! Is the volunteer schedule ready for this week?',
      timestamp: '9:00 AM',
      senderId: '2',
      status: 'read',
    },
    {
      id: 'm2',
      content: 'Yes, I am finalizing it now. Will share by noon.',
      timestamp: '9:05 AM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm3',
      content: 'Can you send the volunteer schedule?',
      timestamp: '11:30 AM',
      senderId: '2',
      status: 'read',
    },
  ],
  '3': [
    {
      id: 'm1',
      content: 'Dr. Kumar, when will the medical camp be ready?',
      timestamp: '8:00 AM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm2',
      content: 'We are setting up now. Equipment has arrived.',
      timestamp: '8:15 AM',
      senderId: '3',
      status: 'read',
    },
    {
      id: 'm3',
      content: 'How many patients are you expecting?',
      timestamp: '8:20 AM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm4',
      content: 'Based on the registration, around 150-200 patients today.',
      timestamp: '8:25 AM',
      senderId: '3',
      status: 'read',
    },
    {
      id: 'm5',
      content: 'Medical camp setup is complete',
      timestamp: '10:00 AM',
      senderId: '3',
      status: 'read',
      attachment: {
        type: 'file',
        name: 'medical-camp-checklist.pdf',
        url: '#',
        size: '245 KB',
      },
    },
  ],
  '4': [
    {
      id: 'm1',
      content: 'How did the volunteer training go today?',
      timestamp: '4:00 PM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm2',
      content: 'It was very productive! 25 new volunteers completed the emergency response training.',
      timestamp: '4:05 PM',
      senderId: '4',
      status: 'read',
    },
    {
      id: 'm3',
      content: 'Training session went well today!',
      timestamp: '4:10 PM',
      senderId: '4',
      status: 'read',
    },
  ],
  '5': [
    {
      id: 'm1',
      content: 'Team update: We have an urgent requirement for tomorrow.',
      timestamp: '2:00 PM',
      senderId: '5',
      status: 'read',
    },
    {
      id: 'm2',
      content: 'What kind of support do you need?',
      timestamp: '2:05 PM',
      senderId: 'current-user',
      status: 'read',
    },
    {
      id: 'm3',
      content: 'We need more volunteers for tomorrow',
      timestamp: '2:10 PM',
      senderId: '5',
      status: 'read',
    },
  ],
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES)

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || null
  const currentMessages = selectedConversationId ? allMessages[selectedConversationId] || [] : []

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    // Clear unread count when selecting a conversation
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    )
  }

  const handleSendMessage = (content: string, attachment?: File) => {
    if (!selectedConversationId) return

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      content,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      senderId: 'current-user',
      status: 'sent',
      ...(attachment && {
        attachment: {
          type: attachment.type.startsWith('image/') ? 'image' : 'file',
          name: attachment.name,
          url: URL.createObjectURL(attachment),
          size: `${(attachment.size / 1024).toFixed(1)} KB`,
        },
      }),
    }

    setAllMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }))

    // Update last message in conversation list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversationId
          ? {
              ...c,
              lastMessage: content || `Sent ${attachment?.type.startsWith('image/') ? 'an image' : 'a file'}`,
              timestamp: 'Just now',
            }
          : c
      )
    )

    // Simulate message delivery after 1 second
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [selectedConversationId]: prev[selectedConversationId]?.map((m) =>
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        ) || [],
      }))
    }, 1000)

    // Simulate message read after 2 seconds
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [selectedConversationId]: prev[selectedConversationId]?.map((m) =>
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        ) || [],
      }))
    }, 2000)
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Conversation List */}
        <div className={`
          ${selectedConversationId ? 'hidden md:flex' : 'flex'}
          w-full md:w-80 lg:w-96 flex-shrink-0
        `}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* Right Panel - Chat Window */}
        <div className={`
          ${selectedConversationId ? 'flex' : 'hidden md:flex'}
          flex-1 flex-col
        `}>
          <ChatWindow
            conversation={selectedConversation}
            messages={currentMessages}
            currentUserId="current-user"
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversationId(null)}
          />
        </div>
      </div>
    </AppLayout>
  )
}
