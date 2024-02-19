import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';

interface Message {
  id: number;
  text: string;
}

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    // Specify the type of the ref as HTMLDivElement to match the element type it refers to
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (): void => {
        if (!newMessage.trim()) return; 
        const message: Message = {
            id: Date.now(), // Simple ID based on timestamp
            text: newMessage,
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '500px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <List sx={{ overflowY: 'auto', flexGrow: 1, bgcolor: 'background.paper' }}>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <Typography variant="body2">{message.text}</Typography>
                    </ListItem>
                ))}
                <div ref={messagesEndRef} />
            </List>
            <Box component="form" sx={{ display: 'flex', p: 1, borderTop: '1px solid #ccc', alignItems: 'center' }} noValidate autoComplete="off">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' ? handleSendMessage() : null}
                    sx={{ mr: 1, flexGrow: 1 }}
                />
            <Button variant="contained" onClick={handleSendMessage} sx={{ height: '56px' }}>Send</Button>
            </Box>
        </Box>
    );
};

export default ChatBox;