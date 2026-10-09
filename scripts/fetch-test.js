/* eslint-disable */
fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sessionId: 'test3',
    messages: [
      { role: 'assistant', content: 'Hi! I am the assistant' },
      { role: 'user', content: 'Ping' }
    ]
  })
}).then(r => r.text()).then(console.log).catch(console.error);
