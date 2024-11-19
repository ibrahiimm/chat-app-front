import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { BsFillSendFill } from "react-icons/bs";

interface ChatAreaProps {
  activeChatId: string | null;
  chats: { id: string; name: string; messages: { sender: "user" | "ai"; text: string }[] }[];
  onSendMessage: (message: string) => void;
  loading: boolean;
  error: string | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  activeChatId,
  chats,
  onSendMessage,
  loading,
  error,
}) => {
  const [input, setInput] = useState<string>("");

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const chatEndRef = useRef<HTMLDivElement | null>(null); // Reference for automatic scroll

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to the bottom whenever the messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages]);

  return (
    <div className="flex-grow-1 d-flex flex-column">
      <div className="flex-grow-1 overflow-auto p-4 bg-white d-flex flex-column">
        {loading ? (
          <div>Loading chats...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : activeChat ? (
          activeChat.messages.map((message, index) => (
            <div
              key={index}
              style={{
                background: message.sender === "user" ? "#6a11cb" : "#2575fc",
                color: "white",
                padding: "12px 18px",
                marginBottom: "10px",
                borderRadius: "20px",
                maxWidth: "75%",
                minWidth: "50px",
                wordWrap: "break-word",
                display: "inline-block",
                alignSelf: message.sender === "user" ? "flex-start" : "flex-end",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              }}
            >
              {message.text}
            </div>
          ))
        ) : (
          <div className="text-center text-muted">Select or create a chat.</div>
        )}
        <div ref={chatEndRef} /> {/* This is the reference for auto-scrolling */}
      </div>

      <div className="border-top p-3 bg-light d-flex align-items-center justify-content-center">
        <InputGroup style={{ width: "80%" }}>
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ resize: "none", padding: "10px" }}
          />
          <Button variant="primary" onClick={handleSendMessage} style={{ borderRadius: "50%" }}>
            <BsFillSendFill />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatArea;