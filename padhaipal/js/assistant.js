const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

let history = []; // { role: 'user'|'assistant', content: string }

function addMsg(text, who){
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

async function sendMessage(text){
  if(!text.trim()) return;
  addMsg(text, 'user');
  history.push({ role: 'user', content: text });
  chatInput.value = '';
  sendBtn.disabled = true;

  const thinking = addMsg('PadhaiPal is thinking...', 'bot thinking');

  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });

    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      throw new Error(err.error || ('Server error: ' + res.status));
    }

    const data = await res.json();
    thinking.remove();
    addMsg(data.reply, 'bot');
    history.push({ role: 'assistant', content: data.reply });
  }catch(e){
    thinking.remove();
    addMsg('Sorry, something went wrong: ' + e.message + '\n\n(If you are the developer: check that GEMINI_API_KEY is set in your environment variables.)', 'bot');
  }finally{
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener('click', ()=> sendMessage(chatInput.value));
chatInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    sendMessage(chatInput.value);
  }
});
chatInput.addEventListener('input', ()=>{
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
});

document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click', ()=> sendMessage(chip.dataset.q));
});
