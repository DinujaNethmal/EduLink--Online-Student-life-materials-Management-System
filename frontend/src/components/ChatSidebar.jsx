import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = ({ currentUser, receiverEmail, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('join', currentUser.email);

        // Fetch history
        fetch(`http://localhost:5000/api/chat/${currentUser.email}/${receiverEmail}`)
            .then(res => res.json())
            .then(data => setMessages(data));

        socketRef.current.on('receiveMessage', (data) => {
            if ((data.sender === currentUser.email && data.receiver === receiverEmail) ||
                (data.sender === receiverEmail && data.receiver === currentUser.email)) {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => socketRef.current.disconnect();
    }, [currentUser.email, receiverEmail]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            sender: currentUser.email,
            receiver: receiverEmail,
            text: newMessage,
            timestamp: new Date()
        };

        socketRef.current.emit('sendMessage', messageData);
        setNewMessage("");
    };

    return (
        <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 h-full w-80 bg-[#1e293b] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(30, 41, 59, 0.95)' }}
        >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {receiverEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-semibold truncate w-40">{receiverEmail}</h3>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.sender === currentUser.email 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white/10 text-white rounded-tl-none'
                        }`}>
                            {msg.text}
                            <p className="text-[10px] opacity-60 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ChatSidebar;
