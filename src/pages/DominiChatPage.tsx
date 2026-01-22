
import React from 'react';
import DominiChat from '../features/domini-chat/components/DominiChat';

const DominiChatPage: React.FC = () => {
    return (
        <div className="h-[calc(100vh-64px)] p-4">
            <DominiChat />
        </div>
    );
};

export default DominiChatPage;
