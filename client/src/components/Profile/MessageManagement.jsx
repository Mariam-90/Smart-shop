import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import './MessageManagement.css';

const MessageManagement = () => {
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:3000/api/contact')
            .then((res) => {
                console.log('Fetched messages:', res.data);
                setMessages(res.data);
            })
            .catch((err) => {
                console.log('Error fetching messages:', err);
            });
    }, []);

    const handleDeleteMessage = async (messageId) => {
        try {
            const url = `http://localhost:3000/api/contact/${messageId}`;
            await axios.delete(url);
            console.log(`Deleted message ${messageId}`);
            setMessages(messages.filter((message) => message._id !== messageId));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleMarkAsTreated = async (messageId) => {
        try {
            const url = `http://localhost:3000/api/contact/${messageId}`;
            await axios.put(url, { treated: true });
            console.log(`Marked message ${messageId} as treated`);
            setMessages(messages.map((message) =>
                message._id === messageId ? { ...message, treated: true } : message
            ));
        } catch (error) {
            console.error("Error marking message as treated:", error);
        }
    };

    return (
        <div className="message-management-container">
            {messages ? (
                <>
                    <h2>טבלת הודעות</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>אימייל</th>
                                <th>הודעה</th>
                                <th>קבצים</th>
                                <th>תאריך</th>
                                <th>סטטוס</th>
                                <th>מחיקה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message, index) => (
                                <tr key={index}>
                                    <td>{message.name}</td>
                                    <td>{message.email}</td>
                                    <td>{message.message}</td>
                                    <td>
                                        {message.files.map((file, i) => (
                                            <a key={i} href={`http://localhost:3000/message-uploads/${file}`} target="_blank" rel="noopener noreferrer">
                                                קובץ {i + 1}
                                            </a>
                                        ))}
                                    </td>
                                    <td>{new Date(message.date).toLocaleString()}</td>
                                    <td>
                                        <Button
                                            variant={message.treated ? "success" : "warning"}
                                            onClick={() => handleMarkAsTreated(message._id)}
                                        >
                                            {message.treated ? "טופלה" : "לא טופלה"}
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDeleteMessage(message._id)}>מחק</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            ) : (
                <h1>אין הודעות עדיין...</h1>
            )}
        </div>
    );
};

export default MessageManagement;
