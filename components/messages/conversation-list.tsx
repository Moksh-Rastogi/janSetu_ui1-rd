'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

export interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  isTyping?: boolean
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-card">
      {/* Search Header */}
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors',
                selectedId === conversation.id
                  ? 'bg-primary/10'
                  : 'hover:bg-muted'
              )}
            >
              {/* Avatar with online indicator */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback>
                    {conversation.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-secondary" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-foreground">
                    {conversation.name}
                  </span>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-muted-foreground">
                    {conversation.isTyping ? (
                      <span className="italic text-primary">typing...</span>
                    ) : (
                      conversation.lastMessage
                    )}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="h-5 min-w-[20px] flex-shrink-0 rounded-full px-1.5 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}

          {filteredConversations.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
