import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, ChevronLeft, User, Search, MoreVertical, Check, CheckCheck, Phone, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = ({ currentUser, receiverEmail: initialReceiver, socket, onClose }) => {
    const [view, setView] = useState(initialReceiver ? "chat" : "list");
    const [receiverEmail, setReceiverEmail] = useState(initialReceiver);
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();

    // Fetch contacts
    useEffect(() => {
        fetch(`http://localhost:5000/api/chat/contacts/${currentUser.email}`)
            .then(res => res.json())
            .then(data => setContacts(data))
            .catch(err => console.error("Contact fetch error:", err));
    }, [currentUser.email, view]);

    // Handle incoming initial receiver
    useEffect(() => {
        if (initialReceiver) {
            setReceiverEmail(initialReceiver);
            setView("chat");
        }
    }, [initialReceiver]);

    // Chat History & Real-time Listeners
    useEffect(() => {
        if (!receiverEmail || view !== "chat") return;

        fetch(`http://localhost:5000/api/chat/${currentUser.email}/${receiverEmail}`)
            .then(res => res.json())
            .then(data => setMessages(data));

        fetch(`http://localhost:5000/api/chat/read/${currentUser.email}/${receiverEmail}`, { method: 'POST' });

        const handleReceive = (data) => {
            const isRelevant = 
                (data.sender === currentUser.email && data.receiver === receiverEmail) ||
                (data.sender === receiverEmail && data.receiver === currentUser.email);
            
            if (isRelevant) {
                setMessages(prev => [...prev, data]);
                if (data.sender === receiverEmail) {
                   fetch(`http://localhost:5000/api/chat/read/${currentUser.email}/${receiverEmail}`, { method: 'POST' });
                }
            }
        };

        if (socket) {
            socket.on('receiveMessage', handleReceive);
            return () => socket.off('receiveMessage', handleReceive);
        }
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

        if (socket) {
            socket.emit('sendMessage', messageData);
            setNewMessage("");
            return;
        }

        fetch('http://localhost:5000/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        })
            .then((res) => {
                if (!res.ok) throw new Error('Send failed');
                setMessages(prev => [...prev, messageData]);
                setNewMessage("");
            })
            .catch(() => {
                // Keep UX simple when realtime backend is unavailable
                setMessages(prev => [...prev, messageData]);
                setNewMessage("");
            });
    };

    const filteredContacts = contacts.filter(c => 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed right-8 bottom-8 w-[420px] h-[680px] z-[9999] flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden"
            style={{ 
                background: '#0b0b15',
                borderRadius: '40px',
                border: '6px solid rgba(255,255,255,0.05)',
                boxSizing: 'border-box'
            }}
        >
            {/* --- PHONE TOP BAR (Status Bar style) --- */}
            <div className="h-8 flex justify-center items-end pb-1 opacity-20">
                <div className="w-24 h-5 bg-black rounded-b-2xl"></div>
            </div>

            <AnimatePresence mode="wait">
                {view === "list" ? (
                    <motion.div 
                        key="list"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        {/* List Header */}
                        <div className="px-8 py-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black text-white tracking-tighter">Messages</h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/30 transition-all"><X size={20}/></button>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search contacts..." 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar">
                            {filteredContacts.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center opacity-10">
                                    <MessageCircle size={64} className="mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Inbox Empty</p>
                                </div>
                            ) : (
                                filteredContacts.map((contact, idx) => (
                                    <motion.button 
                                        whileHover={{ x: 4 }}
                                        key={idx}
                                        onClick={() => { setReceiverEmail(contact.email); setView("chat"); }}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-white/5 rounded-[28px] transition-all group"
                                    >
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/20">
                                                {contact.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0b0b15]"></div>
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-white font-black text-base truncate uppercase tracking-tight">{contact.email.split('@')[0]}</p>
                                                {contact.unreadCount > 0 && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>}
                                            </div>
                                            <p className="text-gray-500 text-xs truncate font-medium">{contact.email}</p>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="chat"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        {/* Chat Header */}
                        <div className="px-6 py-4 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setView("list")} className="p-2 hover:bg-white/5 rounded-2xl text-indigo-400 transition-all"><ChevronLeft size={24}/></button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-black text-sm border border-white/10 uppercase">
                                        {receiverEmail.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-black uppercase tracking-tighter truncate w-32">{receiverEmail.split('@')[0]}</h4>
                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-white/20 hover:text-white transition-colors"><Phone size={18}/></button>
                                <button className="p-2 text-white/20 hover:text-white transition-colors"><Video size={18}/></button>
                                <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors"><X size={20}/></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={i} 
                                    className={`flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] group relative`}>
                                        <div className={`p-4 px-5 rounded-[24px] text-[14px] font-medium leading-relaxed shadow-xl ${
                                            msg.sender === currentUser.email 
                                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                                : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                                        }`}>
                                            {msg.text}
                                            <div className="flex items-center gap-1 justify-end mt-1.5 opacity-30">
                                                <span className="text-[9px] font-bold uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {msg.sender === currentUser.email && <CheckCheck size={10} />}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-6 bg-[#0b0b15] border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Message..." 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-white/20"
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit" 
                                    className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 transition-all"
                                >
                                    <Send size={22} />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- PHONE BOTTOM INDICATOR --- */}
            <div className="h-6 flex justify-center items-center opacity-10">
                <div className="w-32 h-1.5 bg-white rounded-full"></div>
            </div>
        </motion.div>
    );
};

export default ChatSidebar;
