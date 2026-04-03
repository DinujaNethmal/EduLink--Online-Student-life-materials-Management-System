import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, X, MessageCircle, ChevronLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = ({ currentUser, receiverEmail: initialReceiver, socket, onClose }) => {
    const [view, setView] = useState(initialReceiver ? "chat" : "list");
    const [receiverEmail, setReceiverEmail] = useState(initialReceiver);
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();

    // Fetch contacts list
    useEffect(() => {
        fetch(`http://localhost:5000/api/chat/contacts/${currentUser.email}`)
            .then(res => res.json())
            .then(data => setContacts(data));
    }, [currentUser.email, view]);

    // Update receiver if initialReceiver changes (from clicking a NEW chat button)
    useEffect(() => {
        if (initialReceiver) {
            setReceiverEmail(initialReceiver);
            setView("chat");
        }
    }, [initialReceiver]);

    // Fetch history between THESE two specific users
    useEffect(() => {
        if (!receiverEmail || view !== "chat") return;

        fetch(`http://localhost:5000/api/chat/${currentUser.email}/${receiverEmail}`)
            .then(res => res.json())
            .then(data => setMessages(data));

        // Mark as read when opening
        fetch(`http://localhost:5000/api/chat/read/${currentUser.email}/${receiverEmail}`, { method: 'POST' });

        const handleReceive = (data) => {
            const isRelevant = 
                (data.sender === currentUser.email && data.receiver === receiverEmail) ||
                (data.sender === receiverEmail && data.receiver === currentUser.email);
            
            if (isRelevant) {
                setMessages(prev => [...prev, data]);
                // If we are looking at this chat, mark incoming ones read immediately
                if (data.sender === receiverEmail) {
                   fetch(`http://localhost:5000/api/chat/read/${currentUser.email}/${receiverEmail}`, { method: 'POST' });
                }
            }
        };

        socket.on('receiveMessage', handleReceive);
        return () => socket.off('receiveMessage', handleReceive);
    }, [currentUser.email, receiverEmail, socket, view]);

    useEffect(() => {
        if (view === "chat") {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, view]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            sender: currentUser.email,
            receiver: receiverEmail,
            text: newMessage,
            timestamp: new Date()
        };

        socket.emit('sendMessage', messageData);
        setNewMessage("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed right-6 bottom-6 w-[380px] h-[550px] flex flex-col z-2000 overflow-hidden shadow-2xl"
            style={{
                background: 'rgba(15, 15, 25, 0.95)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '28px'
            }}
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center" 
                 style={{ background: 'linear-gradient(to right, rgba(79, 70, 229, 0.15), rgba(192, 38, 211, 0.15))' }}>
                <div className="flex items-center gap-3">
                    {view === "chat" && (
                        <button onClick={() => setView("list")} className="p-1 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner shadow-black/20"
                         style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}>
                        {view === "chat" ? receiverEmail.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-bold truncate w-40">
                            {view === "chat" ? receiverEmail.split('@')[0] : "Your Messages"}
                        </h3>
                        {view === "chat" && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Active</p>
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                </button>
            </div>

            {/* List View */}
            {view === "list" && (
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {contacts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
                            <MessageCircle size={48} className="mb-4" />
                            <p className="text-sm">No recent chats. Start a conversation from "Finding Groups"!</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {contacts.map((contact, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => { setReceiverEmail(contact.email); setView("chat"); }}
                                    className="w-full p-4 flex items-center gap-4 hover:bg-white/5 rounded-2xl transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-white/10 group-hover:bg-indigo-600/20 transition-colors relative">
                                        {contact.email.charAt(0).toUpperCase()}
                                        {contact.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#151519] flex items-center justify-center text-[10px] font-bold text-white">
                                                {contact.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left flex-1 border-b border-white/5 pb-2 group-last:border-none">
                                        <p className={`text-white text-[14px] ${contact.unreadCount > 0 ? 'font-black' : 'font-semibold'}`}>
                                            {contact.email.split('@')[0]}
                                        </p>
                                        <p className="text-white/40 text-[12px] truncate">{contact.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Chat View */}
            {view === "chat" && (
                <>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-[13px] leading-relaxed relative ${
                                    msg.sender === currentUser.email 
                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/30' 
                                        : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                }`}>
                                    {msg.text}
                                    <div className={`text-[9px] opacity-40 mt-1.5 flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-black/30 border-t border-white/10">
                        <div className="flex gap-2.5 items-center">
                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-white text-[13px] focus:outline-none focus:border-indigo-500"
                            />
                            <button type="submit" 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"
                                    style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </motion.div>
    );
};

export default ChatSidebar;
