import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import io from 'socket.io-client';
import './ChatBoxStyles.css';

const socket = io('http://localhost:3000');

interface Message {
  message_id: string;
  text_message: string;
  type?: 'user_message' | 'system_message';
}

// Custom hook for setting up and cleaning up socket listeners
function useSocketListeners(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
  useEffect(() => {
    console.log('Setting up socket listeners');
    const handleReceivedMessage = (message: Message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserJoined = (message: string) => {
      console.log('User joined:', message);
      const systemMessage: Message = {
        message_id: `system-${Date.now()}`, // Improved ID generation
        text_message: message,
        type: 'system_message',
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    };

    socket.on('received_message', handleReceivedMessage);
    socket.on('user_joined', handleUserJoined);

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('received_message', handleReceivedMessage);
      socket.off('user_joined', handleUserJoined);
    };
  }, [setMessages]);
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useSocketListeners(setMessages); // Use the custom hook

  const scrollToBottom = useCallback((): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (): void => {
    if (!newMessage.trim()) return;

    const newMessageObj: Message = {
      message_id: `user-${Date.now()}`, // Improved ID generation
      text_message: newMessage,
      type: 'user_message',
    };

    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    socket.emit('send_message', { text_message: newMessage, auction_id: 'yourRoomId' });
    setNewMessage('');
  };

  // Function to render each message
  const renderMessage = useCallback((message: Message) => (
    <ListItem className={`chatbox-message ${message.type === 'system_message' ? 'system-message' : ''}`} key={message.message_id}>
      <Typography variant="body2">{message.text_message}</Typography>
    </ListItem>
  ), []);

  return (
    <Box className="chatbox-container">
      <List className="chatbox-messages">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </List>
      <Box component="form" className="chatbox-input-area" noValidate autoComplete="off">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chatbox-input"
        />
        <Button variant="contained" onClick={handleSendMessage} className="chatbox-send-button">Send</Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
