import initDarkVeil from '.DarkVeil.js';

// Basic filtering logic and modal rendering
const cardsRoot = document.getElementById('cards');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const requestMatchBtn = document.getElementById('request-match');
const matchModal = document.getElementById('match-modal');
const matchClose = document.getElementById('match-close');
const matchForm = document.getElementById('match-form');
const matchResult = document.getElementById('match-result');

const filterType = document.getElementById('filter-type');
const filterService = document.getElementById('filter-service');
const filterPayment = document.getElementById('filter-payment');
const filterJurisdiction = document.getElementById('filter-jurisdiction');

let banks = [];

async function loadBanks(){
  const res = await fetch('banks.json');
  banks = await res.json();
  render();
}

function render(){
  const type = filterType.value;
  const service = filterService.value;
  const payment = filterPayment.value;
  const juris = filterJurisdiction.value;

  const filtered = banks.filter(b => {
    if(type && b.type !== type) return false;
    if(service && !(b.services || []).includes(service)) return false;
    if(payment && !(b.payments || []).includes(payment)) return false;
    if(juris && b.jurisdiction !== juris) return false;
    return true;
  });

  cardsRoot.innerHTML = filtered.map(cardHTML).join('');
  document.querySelectorAll('.card').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      const item = filtered.find(i => i.id == id) || banks.find(i => i.id == id);
      openModal(item);
    });
  });
}

function cardHTML(item){
  return `
    <div class="card" data-id="${item.id}">
      <h3>${item.name}</h3>
      <p>${item.short || ''}</p>
      <div class="tags">
        ${(item.services || []).map(s => `<span class="tag">${s}</span>`).join('')}
        ${(item.payments || []).map(p => `<span class="tag">${p}</span>`).join('')}
      </div>
    </div>
  `;
}

function openModal(item){
  modalBody.innerHTML = `
    <h2>${item.name}</h2>
    <p>${item.description || ''}</p>
    <ul>
      <li><strong>Type:</strong> ${item.type}</li>
      <li><strong>Jurisdiction:</strong> ${item.jurisdiction}</li>
      <li><strong>Services:</strong> ${(item.services || []).join(', ')}</li>
      <li><strong>Payments:</strong> ${(item.payments || []).join(', ')}</li>
      <li><strong>Onboarding time:</strong> ${item.onboarding || 'n/a'}</li>
      <li><strong>Fees:</strong> ${item.fees || 'n/a'}</li>
    </ul>
    ${item.website ? `<p><a href="${item.website}" target="_blank" rel="noopener">Visit Website →</a></p>` : ''}
  `;
  modal.classList.remove('hidden');
}

modalClose.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.add('hidden'); });

requestMatchBtn.addEventListener('click', () => {
  matchModal.classList.remove('hidden');
});
matchClose.addEventListener('click', () => matchModal.classList.add('hidden'));
matchModal.addEventListener('click', (e) => { if(e.target === matchModal) matchModal.classList.add('hidden'); });

matchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  matchForm.classList.add('hidden');
  matchResult.classList.remove('hidden');
});

[filterType, filterService, filterPayment, filterJurisdiction].forEach(el => el.addEventListener('change', render));

loadBanks();
