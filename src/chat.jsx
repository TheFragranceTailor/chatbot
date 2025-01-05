import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { marked } from "marked";
import { Icon } from '@iconify/react';
import chatIcon from '@iconify-icons/mdi/chat';
import './chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [step, setStep] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const questions = useMemo(() => [
        "What type of smells do you like? (e.g., fresh, woody)",
        "What is your skin type? (e.g., oily, dry)",
        "How would you describe your personality? (e.g., bold, reserved)",
        "What is your budget? (e.g., $, $$, $$$)",
        "What is the occasion? (e.g., casual, formal)"
    ], []);

    useEffect(() => {
        setMessages([{ role: "bot", content: questions[0] }]);
    }, [questions]);

    const sendMessage = async () => {
        const newMessages = [...messages, { role: "user", content: userInput }];
        setMessages(newMessages);

        await axios.post("http://localhost:5000/user-input", {
            step,
            answer: userInput,
        });

        if (step < questions.length - 1) {
            setStep(step + 1);
            setMessages([...newMessages, { role: "bot", content: questions[step + 1] }]);
        } else {
            const response = await axios.post("http://localhost:5000/recommendation");
            const botMessage = marked(response.data.recommendations.content);
            setMessages([...newMessages, { role: "bot", content: botMessage }]);
        }

        setUserInput("");
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div className={`chat-container ${isOpen ? 'open' : ''}`}>
                <div className="chat-box">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
            <button className="fab" onClick={toggleChat}>
                <Icon icon={chatIcon} style={{ color: 'white', fontSize: '30px' }} />
            </button>
        </div>
    );
};

export default Chat;