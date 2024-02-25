import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Message {
  id: string; 
  text: string;
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
        socket.emit('send_message', { text: newMessage, roomId: 'yourRoomId' }); // You need to define how you handle room IDs
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