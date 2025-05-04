/**
 * Messaging System Client Example
 * 
 * This file provides examples of how to connect to the messaging system
 * using Pusher and Laravel Echo.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/**
 * Initialize Laravel Echo
 */
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true
});

/**
 * Listen for messages in the public chat channel
 */
function listenToPublicChat() {
    window.Echo.channel('chat')
        .listen('.new.message', (e) => {
            console.log('New message in public chat:', e.message);
            // Add your UI update logic here
        });
}

/**
 * Listen for private messages sent directly to the current user
 * 
 * @param {number} userId - The ID of the current user
 */
function listenToPrivateMessages(userId) {
    window.Echo.private(`user.${userId}`)
        .listen('.new.message', (e) => {
            console.log('New private message:', e.message);
            // Add your UI update logic here
        });
}

/**
 * Listen for messages in a specific channel
 * 
 * @param {string} channelId - The ID of the channel to listen to
 */
function listenToChannelMessages(channelId) {
    window.Echo.channel(`channel.${channelId}`)
        .listen('.new.message', (e) => {
            console.log(`New message in channel ${channelId}:`, e.message);
            // Add your UI update logic here
        });
}

/**
 * Join a presence room to see who else is in the room
 * and listen for messages
 * 
 * @param {string} roomId - The ID of the room to join
 */
function joinRoom(roomId) {
    window.Echo.join(`room.${roomId}`)
        .here((users) => {
            console.log(`Users currently in room ${roomId}:`, users);
            // Show the list of users in the room
        })
        .joining((user) => {
            console.log(`${user.name} joined room ${roomId}`);
            // Show user joined notification
        })
        .leaving((user) => {
            console.log(`${user.name} left room ${roomId}`);
            // Show user left notification
        })
        .listen('.new.message', (e) => {
            console.log(`New message in room ${roomId}:`, e.message);
            // Add your UI update logic here
        });
}

/**
 * Send a message using the API
 * 
 * @param {string} content - The message content
 * @param {string} recipientId - ID of the recipient (user ID, channel ID, or room ID)
 * @param {string} recipientType - Type of recipient ('user', 'channel', or 'room')
 * @returns {Promise} - Promise that resolves with the API response
 */
async function sendMessage(content, recipientId, recipientType) {
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                content,
                recipient_id: recipientId,
                recipient_type: recipientType
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * Fetch messages for the current user
 * 
 * @param {Object} filters - Optional filters like recipient_id, recipient_type, unread
 * @returns {Promise} - Promise that resolves with the API response
 */
async function fetchMessages(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/messages?${queryParams}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

/**
 * Mark a message as read
 * 
 * @param {number} messageId - The ID of the message to mark as read
 * @returns {Promise} - Promise that resolves with the API response
 */
async function markMessageAsRead(messageId) {
    try {
        const response = await fetch(`/api/messages/${messageId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            credentials: 'same-origin'
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
    }
}

// Export the functions for use in other files
export {
    listenToPublicChat,
    listenToPrivateMessages,
    listenToChannelMessages,
    joinRoom,
    sendMessage,
    fetchMessages,
    markMessageAsRead
};