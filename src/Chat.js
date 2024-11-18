import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:4000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (isJoined) {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      });

      socket.on('message', message => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      socket.on('userList', (users) => {
        setActiveUsers(users);
      });

      return () => {
        unsubscribeMessages();
        socket.off('message');
        socket.off('userList');
      };
    }
  }, [isJoined]);

  const joinChat = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      socket.emit('message', { text: input, user: username });
      await addDoc(collection(db, 'messages'), {
        text: input,
        user: username,
        createdAt: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <form onSubmit={joinChat} className="join-form">
          <h2>Join Chat</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Room</h1>
        <div className="user-info">
          <span>{username}</span>
        </div>
      </div>

      <div className="chat-layout">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={msg.id || index} 
              className={`message ${msg.user === username ? 'sent' : 'received'}`}
            >
              <span className="user">{msg.user}</span>
              <p className="text">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="active-users">
          <h3>Active Users</h3>
          <ul>
            {activeUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;