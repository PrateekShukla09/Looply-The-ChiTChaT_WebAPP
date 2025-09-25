import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const Message = ({ message, isOwn, user }) => {
  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'dd/MM/yyyy HH:mm');
    }
  };

  const getMessageStatus = () => {
    if (!isOwn) return null;

    if (message.readBy && message.readBy.length > 0) {
      return <CheckCheck size={14} className="text-blue-500" />;
    } else if (message.deliveredTo && message.deliveredTo.length > 0) {
      return <CheckCheck size={14} className="text-gray-400" />;
    } else {
      return <Check size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {!isOwn && (
          <img
            src={`https://ui-avatars.com/api/?name=${message.sender?.name}&background=random`}
            alt={message.sender?.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        
        <div className={`relative px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
        }`}>
          {message.replyTo && (
            <div className={`mb-2 p-2 rounded-lg border-l-4 ${
              isOwn 
                ? 'bg-blue-700 border-blue-300' 
                : 'bg-gray-50 border-gray-300'
            }`}>
              <p className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-600'} mb-1`}>
                Replying to {message.replyTo.sender?.name}
              </p>
              <p className={`text-sm ${isOwn ? 'text-blue-100' : 'text-gray-700'} truncate`}>
                {message.replyTo.content}
              </p>
            </div>
          )}

          <div className="break-words text-black">
            {message.messageType === 'text' ? (
              <p className="text-sm">{message.content}</p>
            ) : (
              <div className="space-y-2">
                {message.media && (
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-xs text-gray-600">📎 {message.messageType}</p>
                    <p className="text-xs text-gray-500">{message.media.filename}</p>
                  </div>
                )}
                {message.content && (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-1 mt-1">
            <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
              {formatMessageTime(message.createdAt)}
            </span>
            {getMessageStatus()}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 left-2 flex space-x-1">
              {message.reactions.slice(0, 3).map((reaction, index) => (
                <span
                  key={index}
                  className="bg-white border border-gray-200 rounded-full px-2 py-1 text-xs shadow-sm"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;