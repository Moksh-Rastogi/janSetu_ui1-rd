'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  File,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  X,
} from 'lucide-react'
import type { Conversation } from './conversation-list'

export interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
  status: 'sent' | 'delivered' | 'read'
  attachment?: {
    type: 'image' | 'file'
    name: string
    url: string
    size?: string
  }
}

interface ChatWindowProps {
  conversation: Conversation | null
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string, attachment?: File) => void
}

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim() || selectedFile) {
      onSendMessage(inputValue.trim(), selectedFile || undefined)
      setInputValue('')
      setSelectedFile(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const emojis = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🙏', '💪']

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Send className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Select a conversation</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
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
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-secondary" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{conversation.name}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation.isTyping
                ? 'typing...'
                : conversation.isOnline
                ? 'Online'
                : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isSent = message.senderId === currentUserId

            return (
              <div
                key={message.id}
                className={cn('flex', isSent ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    isSent
                      ? 'rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-bl-md bg-muted text-foreground'
                  )}
                >
                  {/* Attachment */}
                  {message.attachment && (
                    <div className="mb-2">
                      {message.attachment.type === 'image' ? (
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={message.attachment.url}
                            alt={message.attachment.name}
                            className="max-h-48 w-auto object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'flex items-center gap-2 rounded-lg p-2',
                            isSent ? 'bg-primary-foreground/10' : 'bg-background'
                          )}
                        >
                          <File className="h-8 w-8" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {message.attachment.name}
                            </p>
                            {message.attachment.size && (
                              <p className="text-xs opacity-70">
                                {message.attachment.size}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message content */}
                  {message.content && (
                    <p className="text-sm">{message.content}</p>
                  )}

                  {/* Timestamp and status */}
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-1 text-xs',
                      isSent ? 'justify-end opacity-70' : 'opacity-60'
                    )}
                  >
                    <span>{message.timestamp}</span>
                    {isSent && (
                      <span>
                        {message.status === 'read' ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck className="h-3 w-3 opacity-50" />
                        ) : (
                          <Check className="h-3 w-3 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="border-t border-border bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-2">
            {selectedFile.type.startsWith('image/') ? (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <File className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="flex-1 truncate text-sm">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mb-2 flex gap-1 rounded-lg bg-muted p-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputValue((prev) => prev + emoji)
                  setShowEmojiPicker(false)
                }}
                className="rounded p-1 text-lg hover:bg-background"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={handleSend}
            disabled={!inputValue.trim() && !selectedFile}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
