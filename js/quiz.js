const genBtn = document.getElementById('genBtn');
const genStatus = document.getElementById('genStatus');
const quizArea = document.getElementById('quizArea');

let currentQuiz = null;
let answers = {};

genBtn.addEventListener('click', async ()=>{
  const topic = document.getElementById('topic').value.trim();
  const difficulty = document.getElementById('difficulty').value;
  const count = document.getElementById('count').value;

  if(!topic){
    genStatus.textContent = 'Please enter a topic first.';
    return;
  }

  genBtn.disabled = true;
  genStatus.textContent = 'Generating your quiz...';
  quizArea.innerHTML = '';
  answers = {};

  try{
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, count: Number(count) })
    });

    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      throw new Error(err.error || ('Server error: ' + res.status));
    }

    const data = await res.json();
    currentQuiz = data.questions;
    renderQuiz(currentQuiz, topic);
    genStatus.textContent = '';
  }catch(e){
    genStatus.textContent = 'Error: ' + e.message;
  }finally{
    genBtn.disabled = false;
  }
});

function renderQuiz(questions, topic){
  quizArea.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = 'Quiz: ' + topic;
  quizArea.appendChild(heading);

  questions.forEach((q, qi)=>{
    const card = document.createElement('div');
    card.className = 'card question-card';
    card.innerHTML = `<p style="font-weight:600;">${qi+1}. ${escapeHtml(q.question)}</p>`;

    q.options.forEach((opt, oi)=>{
      const optDiv = document.createElement('label');
      optDiv.className = 'opt';
      optDiv.innerHTML = `<input type="radio" name="q${qi}" value="${oi}"> <span>${escapeHtml(opt)}</span>`;
      optDiv.querySelector('input').addEventListener('change', ()=>{
        answers[qi] = oi;
      });
      card.appendChild(optDiv);
    });

    quizArea.appendChild(card);
  });

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = 'Submit quiz';
  submitBtn.addEventListener('click', ()=> gradeQuiz(questions));
  quizArea.appendChild(submitBtn);
}

function gradeQuiz(questions){
  let score = 0;
  questions.forEach((q, qi)=>{
    const chosen = answers[qi];
    const optDivs = document.querySelectorAll(`input[name="q${qi}"]`);
    optDivs.forEach((input, oi)=>{
      const label = input.closest('.opt');
      if(oi === q.correctIndex) label.classList.add('correct');
      else if(oi === chosen) label.classList.add('wrong');
      input.disabled = true;
    });
    if(chosen === q.correctIndex) score++;

    const expl = document.createElement('p');
    expl.className = 'muted';
    expl.style.fontSize = '.85rem';
    expl.style.marginTop = '10px';
    expl.textContent = '✓ ' + q.explanation;
    document.querySelectorAll('.question-card')[qi].appendChild(expl);
  });

  const banner = document.createElement('div');
  banner.className = 'score-banner';
  banner.innerHTML = `<div>Your score</div><div class="big">${score} / ${questions.length}</div>`;
  quizArea.insertBefore(banner, quizArea.children[1]);

  document.querySelector('#quizArea button').remove();
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
