const STORAGE_KEY = 'padhaipal_sessions';

function loadSessions(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){
    return [];
  }
}

function saveSessions(sessions){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function render(){
  const sessions = loadSessions().sort((a,b)=> new Date(b.date) - new Date(a.date));
  const body = document.getElementById('sessionsBody');
  const empty = document.getElementById('emptyState');
  const table = document.getElementById('sessionsTable');
  body.innerHTML = '';

  if(sessions.length === 0){
    table.style.display = 'none';
    empty.style.display = 'block';
  }else{
    table.style.display = 'table';
    empty.style.display = 'none';
    sessions.forEach((s)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${formatDate(s.date)}</td><td>${escapeHtml(s.subject)}</td><td>${s.minutes} min</td>
        <td><button class="del" data-id="${s.id}">Remove</button></td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll('.del').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.id;
        const remaining = loadSessions().filter(s => String(s.id) !== id);
        saveSessions(remaining);
        render();
      });
    });
  }

  updateStats(sessions);
}

function updateStats(sessions){
  const totalMinutes = sessions.reduce((sum,s)=> sum + Number(s.minutes), 0);
  document.getElementById('statTotal').textContent = (totalMinutes/60).toFixed(1);
  document.getElementById('statSessions').textContent = sessions.length;
  document.getElementById('statSubjects').textContent = new Set(sessions.map(s=>s.subject.toLowerCase())).size;
  document.getElementById('statStreak').textContent = computeStreak(sessions);
}

function computeStreak(sessions){
  const days = new Set(sessions.map(s => s.date));
  let streak = 0;
  let cursor = new Date();
  while(true){
    const iso = cursor.toISOString().slice(0,10);
    if(days.has(iso)){
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }else{
      break;
    }
  }
  return streak;
}

function formatDate(iso){
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('logdate').valueAsDate = new Date();

document.getElementById('logForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const subject = document.getElementById('subject').value.trim();
  const minutes = Number(document.getElementById('minutes').value);
  const date = document.getElementById('logdate').value;

  if(!subject || !minutes || !date) return;

  const sessions = loadSessions();
  sessions.push({ id: Date.now(), subject, minutes, date });
  saveSessions(sessions);

  document.getElementById('logForm').reset();
  document.getElementById('logdate').valueAsDate = new Date();
  render();
});

render();
