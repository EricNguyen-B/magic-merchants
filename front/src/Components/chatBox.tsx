import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import io from 'socket.io-client';
import './ChatBoxStyles.css';

// Assuming this is the correct URL for your Socket.IO server
const socket = io('http://localhost:3000');

interface Message {
  message_id: string;
  text_message: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on('received_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('received_message');
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (): void => {
    if (!newMessage.trim()) return;
    socket.emit('send_message', { text_message: newMessage, auction_id: 'yourRoomId' });
    setNewMessage('');
  };

  return (
    <Box className="chatbox-container">
      <List className="chatbox-messages">
        {messages.map((message) => (
          <ListItem className="chatbox-message" key={message.message_id}>
            <Typography variant="body2">{message.text_message}</Typography>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Box component="form" className="chatbox-input-area" noValidate autoComplete="off">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          className="chatbox-input"
        />
        <Button variant="contained" onClick={handleSendMessage} className="chatbox-send-button">Send</Button>
      </Box>
    </Box>
  );
};

export default ChatBox;

