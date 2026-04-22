// ── DevPulse — app.js ──────────────────────────────────────────────

// ── Références DOM ────────────────────────────────────────────────
const projectInput  = document.getElementById('projectInput');
const statusSelect  = document.getElementById('statusSelect');
const branchSelect  = document.getElementById('branchSelect');
const addBtn        = document.getElementById('addBtn');
const deployList    = document.getElementById('deployList');
const filterBtns    = document.querySelectorAll('.filter-btn');
const envBadge      = document.getElementById('envBadge');
const buildInfo     = document.getElementById('buildInfo');

// Affiche l'environnement injecté par le workflow GitHub Actions
// (via window.ENV défini dans le HTML généré) ou "dev" par défaut
envBadge.textContent = window.ENV   || 'dev';
buildInfo.textContent = window.BUILD || 'build #local';

// ── État de l'application ─────────────────────────────────────────
let deployments = JSON.parse(localStorage.getItem('devpulse_deployments') || '[]');
let activeFilter = 'all';

// ── Icônes par statut ─────────────────────────────────────────────
const STATUS_ICON = {
  success: '✅',
  running: '🔄',
  failed:  '❌',
};

// ── Sauvegarde locale ─────────────────────────────────────────────
function save() {
  localStorage.setItem('devpulse_deployments', JSON.stringify(deployments));
}

// ── Rendu de la liste ─────────────────────────────────────────────
function render() {
  deployList.innerHTML = '';

  const visible = deployments.filter(d => {
    if (activeFilter === 'all') return true;
    return d.status === activeFilter;
  });

  if (visible.length === 0) {
    deployList.innerHTML = '<li class="empty-state">Aucun déploiement ici 🚀</li>';
  } else {
    visible.forEach(d => {
      const li = document.createElement('li');
      li.className = `deploy-item ${d.status}`;
      li.dataset.id = d.id;

      li.innerHTML = `
        <span class="status-icon">${STATUS_ICON[d.status]}</span>
        <div class="deploy-info">
          <div class="deploy-project">${escapeHtml(d.project)}</div>
          <div class="deploy-meta">
            <span class="branch-tag">${escapeHtml(d.branch)}</span>
            ${d.date}
          </div>
        </div>
        <button class="delete-btn" title="Supprimer">✕</button>
      `;

      li.querySelector('.delete-btn').addEventListener('click', () => remove(d.id));
      deployList.appendChild(li);
    });
  }

  updateStats();
}

// ── Mise à jour des statistiques ──────────────────────────────────
function updateStats() {
  const total   = deployments.length;
  const success = deployments.filter(d => d.status === 'success').length;
  const running = deployments.filter(d => d.status === 'running').length;
  const failed  = deployments.filter(d => d.status === 'failed').length;

  document.getElementById('totalCount').textContent   = total;
  document.getElementById('successCount').textContent = success;
  document.getElementById('runningCount').textContent = running;
  document.getElementById('failedCount').textContent  = failed;
}

// ── Ajouter un déploiement ────────────────────────────────────────
function addDeployment() {
  const project = projectInput.value.trim();
  if (!project) { projectInput.focus(); return; }

  deployments.unshift({
    id:      Date.now(),
    project,
    status:  statusSelect.value,
    branch:  branchSelect.value,
    date:    new Date().toLocaleString('fr-FR'),
  });

  projectInput.value = '';
  projectInput.focus();
  save();
  render();
}

// ── Supprimer un déploiement ──────────────────────────────────────
function remove(id) {
  deployments = deployments.filter(d => d.id !== id);
  save();
  render();
}

// ── Filtres ───────────────────────────────────────────────────────
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

// ── Événements ────────────────────────────────────────────────────
addBtn.addEventListener('click', addDeployment);
projectInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addDeployment();
});

// ── Utilitaire : échapper le HTML pour éviter les injections ──────
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ── Initialisation ────────────────────────────────────────────────
render();
