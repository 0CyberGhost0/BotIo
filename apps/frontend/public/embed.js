// embed.js
(function() {
    // Configuration from script tag attributes
    const scriptTag = document.currentScript;
    const botId = scriptTag.id;
    const autoOpen = scriptTag.getAttribute('open') === 'true';
    const openDelay = parseInt(scriptTag.getAttribute('openDelay') || '0', 10);
    
    // Create container elements
    const createChatElements = () => {
      // Container for the entire chat widget
      const container = document.createElement('div');
      container.id = 'chat-widget-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '999999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'flex-end';
      
      // Typing text animation above the button
      const typingTextContainer = document.createElement('div');
      typingTextContainer.id = 'chat-typing-text';
      typingTextContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
      typingTextContainer.style.color = 'white';
      typingTextContainer.style.padding = '12px 16px';
      typingTextContainer.style.borderRadius = '12px';
      typingTextContainer.style.marginBottom = '12px';
      typingTextContainer.style.fontSize = '15px';
      typingTextContainer.style.fontFamily = 'Arial, sans-serif';
      typingTextContainer.style.maxWidth = '220px';
      typingTextContainer.style.textAlign = 'center';
      typingTextContainer.style.animation = 'fadeIn 0.5s ease-in-out';
      typingTextContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
      typingTextContainer.style.transform = 'translateX(-10px)';
      typingTextContainer.style.fontWeight = '500';
      
      // Create the typing animation span
      const typingText = document.createElement('span');
      typingText.id = 'typing-text-content';
      typingText.textContent = '';
      typingTextContainer.appendChild(typingText);
      
      // Add animation styles
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        #chat-widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        #typing-cursor {
          display: inline-block;
          width: 2px;
          height: 14px;
          background-color: white;
          margin-left: 2px;
          animation: blink 1s infinite;
          vertical-align: middle;
        }
        
        #chat-widget-window {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
      
      // Button to open the chat
      const chatButton = document.createElement('button');
      chatButton.id = 'chat-widget-button';
      chatButton.style.width = '64px';
      chatButton.style.height = '64px';
      chatButton.style.borderRadius = '50%';
      chatButton.style.backgroundColor = '#4f46e5'; // indigo-600
      chatButton.style.border = 'none';
      chatButton.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.4)';
      chatButton.style.cursor = 'pointer';
      chatButton.style.display = 'flex';
      chatButton.style.alignItems = 'center';
      chatButton.style.justifyContent = 'center';
      chatButton.style.color = 'white';
      chatButton.style.transition = 'all 0.2s ease';
      chatButton.style.animation = 'pulse 2s infinite ease-in-out';
      chatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
      
      // Chat window container
      const chatWindow = document.createElement('div');
      chatWindow.id = 'chat-widget-window';
      chatWindow.style.position = 'absolute';
      chatWindow.style.bottom = '80px';
      chatWindow.style.right = '0';
      chatWindow.style.width = '380px';
      chatWindow.style.height = '520px';
      chatWindow.style.backgroundColor = '#1f1f1f';
      chatWindow.style.borderRadius = '16px';
      chatWindow.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
      chatWindow.style.overflow = 'hidden';
      chatWindow.style.display = 'none';
      chatWindow.style.border = '1px solid #3f3f3f';
      
      // Close button
      const closeButton = document.createElement('button');
      closeButton.id = 'chat-widget-close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '12px';
      closeButton.style.right = '12px';
      closeButton.style.backgroundColor = 'rgba(0,0,0,0.2)';
      closeButton.style.border = 'none';
      closeButton.style.color = '#9ca3af';
      closeButton.style.fontSize = '16px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.width = '26px';
      closeButton.style.height = '26px';
      closeButton.style.borderRadius = '50%';
      closeButton.style.display = 'flex';
      closeButton.style.alignItems = 'center';
      closeButton.style.justifyContent = 'center';
      closeButton.style.transition = 'all 0.2s ease';
      closeButton.innerHTML = '✕';
      closeButton.style.padding = '0';
      
      closeButton.addEventListener('mouseover', () => {
        closeButton.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        closeButton.style.color = '#ef4444';
      });
      
      closeButton.addEventListener('mouseout', () => {
        closeButton.style.backgroundColor = 'rgba(0,0,0,0.2)';
        closeButton.style.color = '#9ca3af';
      });
      
      // Chat header
      const chatHeader = document.createElement('div');
      chatHeader.style.padding = '14px 16px';
      chatHeader.style.borderBottom = '1px solid #3f3f3f';
      chatHeader.style.backgroundColor = '#2a2a2a';
      chatHeader.style.display = 'flex';
      chatHeader.style.alignItems = 'center';
      chatHeader.style.justifyContent = 'space-between';
      
      const headerContent = document.createElement('h2');
      headerContent.style.fontSize = '16px';
      headerContent.style.fontWeight = '600';
      headerContent.style.margin = '0';
      headerContent.style.color = 'white';
      headerContent.style.display = 'flex';
      headerContent.style.alignItems = 'center';
      headerContent.innerHTML = '<div style="width: 24px; height: 24px; background-color: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; color: white; font-size: 12px;">🤖</div>AI Assistant';
      
      chatHeader.appendChild(headerContent);
      chatWindow.appendChild(chatHeader);
      
      // Chat messages container
      const messagesContainer = document.createElement('div');
      messagesContainer.id = 'chat-widget-messages';
      messagesContainer.style.height = 'calc(100% - 140px)'; // Adjusted for the powered by footer
      messagesContainer.style.overflowY = 'auto';
      messagesContainer.style.padding = '14px';
      messagesContainer.style.scrollBehavior = 'smooth';
      
      // Chat input area
      const inputContainer = document.createElement('div');
      inputContainer.style.padding = '12px 14px';
      inputContainer.style.borderTop = '1px solid #3f3f3f';
      inputContainer.style.backgroundColor = '#2a2a2a';
      inputContainer.style.position = 'absolute';
      inputContainer.style.bottom = '30px'; // Adjusted for the powered by footer
      inputContainer.style.width = '100%';
      
      const inputForm = document.createElement('form');
      inputForm.id = 'chat-widget-form';
      inputForm.style.position = 'relative';
      
      const input = document.createElement('input');
      input.id = 'chat-widget-input';
      input.type = 'text';
      input.placeholder = 'Type your message...';
      input.style.width = '100%';
      input.style.padding = '10px 40px 10px 14px';
      input.style.borderRadius = '9999px';
      input.style.border = '1px solid #4b5563';
      input.style.backgroundColor = '#1f1f1f';
      input.style.color = 'white';
      input.style.fontSize = '14px';
      input.style.outline = 'none';
      input.style.transition = 'border-color 0.2s ease';
      
      input.addEventListener('focus', () => {
        input.style.borderColor = '#4f46e5';
      });
      
      input.addEventListener('blur', () => {
        input.style.borderColor = '#4b5563';
      });
      
      const sendButton = document.createElement('button');
      sendButton.type = 'submit';
      sendButton.style.position = 'absolute';
      sendButton.style.right = '8px';
      sendButton.style.top = '50%';
      sendButton.style.transform = 'translateY(-50%)';
      sendButton.style.width = '28px';
      sendButton.style.height = '28px';
      sendButton.style.borderRadius = '50%';
      sendButton.style.backgroundColor = '#4f46e5';
      sendButton.style.display = 'flex';
      sendButton.style.alignItems = 'center';
      sendButton.style.justifyContent = 'center';
      sendButton.style.border = 'none';
      sendButton.style.cursor = 'pointer';
      sendButton.style.transition = 'all 0.2s ease';
      sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
      
      sendButton.addEventListener('mouseover', () => {
        sendButton.style.backgroundColor = '#4338ca'; // darker indigo
      });
      
      sendButton.addEventListener('mouseout', () => {
        sendButton.style.backgroundColor = '#4f46e5';
      });
      
      // Add the "Powered by BotIo" footer
      const poweredByFooter = document.createElement('div');
      poweredByFooter.style.position = 'absolute';
      poweredByFooter.style.bottom = '0';
      poweredByFooter.style.width = '100%';
      poweredByFooter.style.textAlign = 'center';
      poweredByFooter.style.padding = '6px 0';
      poweredByFooter.style.fontSize = '12px';
      poweredByFooter.style.color = '#9ca3af';
      poweredByFooter.style.borderTop = '1px solid #3f3f3f';
      poweredByFooter.style.backgroundColor = '#222';
      poweredByFooter.innerHTML = 'Powered by <span style="color: #4f46e5; font-weight: 600;">BotIo</span>';
      
      inputForm.appendChild(input);
      inputForm.appendChild(sendButton);
      inputContainer.appendChild(inputForm);
      
      chatWindow.appendChild(closeButton);
      chatWindow.appendChild(messagesContainer);
      chatWindow.appendChild(inputContainer);
      chatWindow.appendChild(poweredByFooter);
      
      container.appendChild(typingTextContainer);
      container.appendChild(chatButton);
      container.appendChild(chatWindow);
      
      return { 
        container, 
        chatButton, 
        chatWindow, 
        closeButton, 
        messagesContainer, 
        inputForm, 
        input,
        typingTextContainer,
        typingText
      };
    };
    
    // Initialize chat functionality
    const initChat = () => {
      const elements = createChatElements();
      document.body.appendChild(elements.container);
      
      let messages = [];
      let isLoading = false;
      let chatId = null;
      let botName = "AI Assistant";
      
      // Start typing animation
      const startTypingAnimation = () => {
        const text = "👋 Need help? Chat with me!";
        const cursor = document.createElement('span');
        cursor.id = 'typing-cursor';
        
        let charIndex = 0;
        elements.typingText.textContent = '';
        elements.typingText.appendChild(cursor);
        
        const typeEffect = setInterval(() => {
          if (charIndex < text.length) {
            elements.typingText.textContent = text.substring(0, charIndex + 1);
            elements.typingText.appendChild(cursor);
            charIndex++;
          } else {
            clearInterval(typeEffect);
            // Remove cursor after typing is complete
            setTimeout(() => {
              if (cursor.parentNode === elements.typingText) {
                elements.typingText.removeChild(cursor);
              }
            }, 1500);
          }
        }, 100);
      };
      
      // Start typing animation after a short delay
      setTimeout(startTypingAnimation, 500);
      
      // Toggle chat window
      const toggleChat = (show) => {
        if (show) {
          elements.chatWindow.style.display = 'block';
          setTimeout(() => {
            elements.input.focus();
          }, 300);
        } else {
          elements.chatWindow.style.display = 'none';
        }
        
        // Hide typing text when chat is open
        elements.typingTextContainer.style.display = show ? 'none' : 'block';
        
        // Stop button pulse animation when chat is open
        if (show) {
          elements.chatButton.style.animation = 'none';
        } else {
          elements.chatButton.style.animation = 'pulse 2s infinite ease-in-out';
        }
        
        // Initialize chat if it's being opened for the first time
        if (show && !chatId) {
          fetchBotInfoAndStartChat();
        }
      };
      
      // Event listeners
      elements.chatButton.addEventListener('click', () => toggleChat(true));
      elements.closeButton.addEventListener('click', () => toggleChat(false));
      
      // Format timestamp
      const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      
      // Render message with bold formatting
      const renderMessageWithBold = (content) => {
        return content.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600; color: white;">$1</strong>');
      };
      
      // Add message to UI
      const addMessageToUI = (message) => {
        const messageEl = document.createElement('div');
        messageEl.style.display = 'flex';
        messageEl.style.marginBottom = '16px';
        messageEl.style.justifyContent = message.role === 'user' ? 'flex-end' : 'flex-start';
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(10px)';
        messageEl.style.transition = 'all 0.3s ease';
        
        let messageHtml = '';
        
        if (message.role === 'assistant') {
          messageHtml += `
            <div style="width: 28px; height: 28px; background-color: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; color: white; font-size: 12px; flex-shrink: 0;">
              🤖
            </div>
          `;
        }
        
        messageHtml += `
          <div style="max-width: 80%; padding: 10px 12px; border-radius: 12px; background-color: ${
            message.role === 'user' ? '#4f46e5' : '#333333'
          }; color: ${message.role === 'user' ? 'white' : '#e5e7eb'}; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">${renderMessageWithBold(message.content)}</p>
            <p style="text-align: right; margin: 4px 0 0; font-size: 11px; color: ${message.role === 'user' ? 'rgba(255,255,255,0.7)' : '#9ca3af'};">
              ${formatTime(message.createdAt)}
            </p>
          </div>
        `;
        
        if (message.role === 'user') {
          messageHtml += `
            <div style="width: 28px; height: 28px; background-color: #4b5563; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 10px; color: white; font-size: 12px; flex-shrink: 0;">
              👤
            </div>
          `;
        }
        
        messageEl.innerHTML = messageHtml;
        elements.messagesContainer.appendChild(messageEl);
        
        // Animate the message appearance
        setTimeout(() => {
          messageEl.style.opacity = '1';
          messageEl.style.transform = 'translateY(0)';
        }, 50);
        
        // Scroll to bottom with smooth animation
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
      };
      
      // Show loading indicator
      const showLoadingIndicator = () => {
        const loadingEl = document.createElement('div');
        loadingEl.id = 'chat-loading-indicator';
        loadingEl.style.display = 'flex';
        loadingEl.style.justifyContent = 'flex-start';
        loadingEl.style.marginBottom = '16px';
        loadingEl.style.opacity = '0';
        loadingEl.style.transform = 'translateY(10px)';
        loadingEl.style.transition = 'all 0.3s ease';
        
        loadingEl.innerHTML = `
          <div style="width: 28px; height: 28px; background-color: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; color: white; font-size: 12px; flex-shrink: 0;">
            🤖
          </div>
          <div style="background-color: #333333; padding: 10px 12px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 8px; align-items: center;">
              <div style="width: 6px; height: 6px; background-color: #9ca3af; border-radius: 50%; animation: bounce 1s infinite;"></div>
              <div style="width: 6px; height: 6px; background-color: #9ca3af; border-radius: 50%; animation: bounce 1s infinite; animation-delay: 0.15s;"></div>
              <div style="width: 6px; height: 6px; background-color: #9ca3af; border-radius: 50%; animation: bounce 1s infinite; animation-delay: 0.3s;"></div>
            </div>
          </div>
        `;
        
        elements.messagesContainer.appendChild(loadingEl);
        
        // Animate the loading indicator appearance
        setTimeout(() => {
          loadingEl.style.opacity = '1';
          loadingEl.style.transform = 'translateY(0)';
        }, 50);
        
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        
        // Add bounce animation
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `;
        document.head.appendChild(style);
      };
      
      // Hide loading indicator
      const hideLoadingIndicator = () => {
        const loadingEl = document.getElementById('chat-loading-indicator');
        if (loadingEl) {
          // Fade out animation
          loadingEl.style.opacity = '0';
          loadingEl.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            if (loadingEl.parentNode) {
              loadingEl.parentNode.removeChild(loadingEl);
            }
          }, 300);
        }
      };
      
      // Show error message
      const showError = (message) => {
        const errorEl = document.createElement('div');
        errorEl.style.backgroundColor = 'rgba(127, 29, 29, 0.5)';
        errorEl.style.border = '1px solid #b91c1c';
        errorEl.style.color = '#fecaca';
        errorEl.style.padding = '10px 12px';
        errorEl.style.borderRadius = '8px';
        errorEl.style.margin = '12px auto';
        errorEl.style.fontSize = '14px';
        errorEl.style.textAlign = 'center';
        errorEl.style.maxWidth = '90%';
        errorEl.style.opacity = '0';
        errorEl.style.transform = 'translateY(10px)';
        errorEl.style.transition = 'all 0.3s ease';
        errorEl.textContent = message;
        
        elements.messagesContainer.appendChild(errorEl);
        
        // Animate the error message appearance
        setTimeout(() => {
          errorEl.style.opacity = '1';
          errorEl.style.transform = 'translateY(0)';
        }, 50);
        
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        
        // Auto-remove error after 5 seconds
        setTimeout(() => {
          errorEl.style.opacity = '0';
          errorEl.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            if (errorEl.parentNode) {
              errorEl.parentNode.removeChild(errorEl);
            }
          }, 300);
        }, 5000);
      };
      
      // Fetch bot info and initialize chat
      const fetchBotInfoAndStartChat = async () => {
        try {
          isLoading = true;
          
          // Replace with your API URL
          const botResponse = await fetch(`http://localhost:8000/bots/embed/${botId}`);
          if (!botResponse.ok) throw new Error('Failed to fetch bot information');
          
          const bot = await botResponse.json();
          botName = bot.name;
          
          // Update header with bot name
          const headerText = elements.chatWindow.querySelector('h2');
          headerText.innerHTML = `<div style="width: 24px; height: 24px; background-color: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; color: white; font-size: 12px;">🤖</div>${botName}`;
          
          // Create chat session
          const chatResponse = await fetch('http://localhost:8000/bots/embed/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ botId })
          });
          
          if (!chatResponse.ok) throw new Error('Failed to create chat session');
          
          const newChat = await chatResponse.json();
          chatId = newChat.id;
          
          // Add welcome message
          const welcomeMessage = {
            id: 'welcome',
            content: `👋 Hello! I'm ${botName}. How can I help you today?`,
            role: 'assistant',
            createdAt: new Date().toISOString()
          };
          
          messages.push(welcomeMessage);
          addMessageToUI(welcomeMessage);
          
        } catch (error) {
          console.error('Error initializing chat:', error);
          showError('Failed to initialize chat. Please try again.');
        } finally {
          isLoading = false;
        }
      };
      
      // Send message to backend
      const sendMessage = async (content) => {
        if (!content.trim() || !chatId || isLoading) return;
        
        const userMessage = {
          id: Date.now().toString(),
          content,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        messages.push(userMessage);
        addMessageToUI(userMessage);
        elements.input.value = '';
        
        isLoading = true;
        showLoadingIndicator();
        
        try {
          // Replace with your API URL
          const response = await fetch(`http://localhost:8000/bots/embed/chat/${chatId}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, botId })
          });
          
          if (!response.ok) throw new Error('Failed to send message');
          
          const data = await response.json();
          const botMessage = data.botResponse;
          
          messages.push(botMessage);
          hideLoadingIndicator();
          addMessageToUI(botMessage);
          
        } catch (error) {
          console.error('Error sending message:', error);
          hideLoadingIndicator();
          showError('Failed to send message. Please try again.');
        } finally {
          isLoading = false;
        }
      };
      
      // Handle form submission
      elements.inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = elements.input.value;
        sendMessage(content);
      });
      
      // Handle Enter key press
      elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const content = elements.input.value;
          sendMessage(content);
        }
      });
      
      // Auto-open chat after delay if configured
      if (autoOpen && openDelay > 0) {
        setTimeout(() => {
          toggleChat(true);
        }, openDelay);
      } else if (autoOpen) {
        toggleChat(true);
      }
    };
    
    // Initialize once DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChat);
    } else {
      initChat();
    }
  })();