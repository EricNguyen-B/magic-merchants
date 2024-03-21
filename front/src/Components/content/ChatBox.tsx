import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import '../../styles/AuctionRoomStyles.css';
import { SocketContext } from '../../Context/SocketContext';
import {Room} from '../../types';
import { useCookies } from 'react-cookie';

interface Message {
  message_id: string;
  text_message: string;
  type?: 'user_message' | 'system_message';
}

const ChatBox= (room: Room) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socket = useContext(SocketContext).socket;

  const scrollToBottom = useCallback((): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages]);
  const handleSendMessage = (): void => {
    if (!newMessage.trim()) return;
    const newMessageObj: Message = {
      message_id: `user-${Date.now()}`, 
      text_message: newMessage,
      type: 'user_message',
    };
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    socket?.emit('send_message', { text_message: newMessage, auction_id: room.id});
    setNewMessage('');
  };

  //socket
  useEffect(() => {
    socket?.on("received_message", (data) => {setMessages((prevMessages) => [...prevMessages, data]);})
    },[socket]);

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