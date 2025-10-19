const socket = io();

// --- FUNÇÃO AUXILIAR PARA ESTILO DOS CARDS ---
function setCardStyle(cardId, color) {
  const cardEl = document.getElementById(cardId);
  if (cardEl) {
    cardEl.style.borderColor = color;
    // Adiciona um brilho para destacar o estado
    cardEl.style.boxShadow = `0 0 15px ${color}`;
  }
}

// --- FUNÇÕES PARA ATUALIZAR A UI DOS DISPOSITIVOS ---
function atualizarTelemovel(estado) {
  const statusEl = document.getElementById('lanterna-status');
  const visualEl = document.getElementById('lanterna-visual');

  if (statusEl) {
    statusEl.textContent = estado.lanterna === 'ligada' ? '🟢 Ligada: 💡' : '🔴 Desligada';
    statusEl.className = estado.lanterna === 'ligada' ? 'ligado' : 'desligado';
  }
  if (visualEl) {
    visualEl.classList.toggle('ligada', estado.lanterna === 'ligada');
  }
  const color = estado.lanterna === 'ligada' ? '#28a745' : '#d10303';
  setCardStyle('card-telemovel', color);
}

function atualizarMaquinaCafe(estado) {
  const statusEl = document.getElementById('cafe-status');

  if (statusEl) {
    let statusText = '🔴 Desligada';
    let statusClass = 'desligado';
    let borderColor = '#d10303';

    if (estado.estado === 'a preparar') {
      statusText = 'A preparar café...🥛';
      statusClass = 'preparing';
      borderColor = '#ffc107'; // Amarelo para "em progresso"
    } else if (estado.estado === 'pronto') {
      statusText = 'Café pronto!☕';
      statusClass = 'ligado';
      borderColor = '#28a745'; // Verde para "pronto"
    }
    statusEl.textContent = statusText;
    statusEl.className = statusClass;
    setCardStyle('card-maquina_cafe', borderColor);
  }
}

function atualizarAC(estado) {
  const statusEl = document.getElementById('ac-status');
  const tempDisplayEl = document.getElementById('ac-temp-display');

  if (statusEl) {
    statusEl.textContent = estado.estado === 'ligado' ? 'Ligado: ❄️' : '🔴 Desligado';
    statusEl.className = estado.estado === 'ligado' ? 'ligado' : 'desligado';
  }
  if (tempDisplayEl) {
    tempDisplayEl.textContent = tempDisplayEl.classList.contains('temp-display')
      ? `${estado.temperatura}°C`
      : estado.temperatura;
  }
  const color = estado.estado === 'ligado' ? '#28a745' : '#d10303';
  setCardStyle('card-ac', color);
}

// --- LÓGICA DE COMUNICAÇÃO COM O SERVIDOR ---

// Recebe os estados iniciais ao conectar para garantir que a UI esteja sincronizada.
socket.on('initial_states', (states) => {
  console.log('Estados iniciais recebidos:', states);
  atualizarTelemovel(states.telemovel);
  atualizarMaquinaCafe(states.maquina_cafe);
  atualizarAC(states.ac);
});

// Ouve por mudanças de estado para manter a UI atualizada em tempo real.
socket.on('state_changed', (data) => {
  console.log('Estado alterado:', data);
  const updaters = {
    telemovel: atualizarTelemovel,
    maquina_cafe: atualizarMaquinaCafe,
    ac: atualizarAC,
  };
  if (updaters[data.device]) {
    updaters[data.device](data.states[data.device]);
  }
});

// --- EVENT LISTENERS DO PAINEL DE CONTROLO ---
if (document.getElementById('btn-lanterna-ligar')) {
  // Telemóvel
  document.getElementById('btn-lanterna-ligar').addEventListener('click', () => {
    socket.emit('control_device', { device: 'telemovel', command: 'ligar' });
  });
  document.getElementById('btn-lanterna-desligar').addEventListener('click', () => {
    socket.emit('control_device', { device: 'telemovel', command: 'desligar' });
  });

  // Máquina de Café
  document.getElementById('btn-cafe-ligar').addEventListener('click', () => {
    socket.emit('control_device', { device: 'maquina_cafe', command: 'ligar' });
  });
  document.getElementById('btn-cafe-desligar').addEventListener('click', () => {
    socket.emit('control_device', { device: 'maquina_cafe', command: 'desligar' });
  });

  // Ar Condicionado
  document.getElementById('btn-ac-toggle').addEventListener('click', () => {
    socket.emit('control_device', { device: 'ac', command: 'ligar_desligar' });
  });
  document.getElementById('ac-temp-slider').addEventListener('input', (e) => {
    const newTemp = e.target.value;
    document.getElementById('ac-temp-display').textContent = newTemp; // Feedback visual imediato
    socket.emit('control_device', {
      device: 'ac',
      command: 'set_temperatura',
      value: newTemp,
    });
  });
}

// --- LÓGICA PARA ALTERNAR O TEMA ---
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.getElementById('btn-theme-toggle');
  const body = document.body;

  // Verifica o tema guardado no localStorage ao carregar a página.
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggleButton) themeToggleButton.textContent = '☀️';
  }

  // Adiciona o evento de clique para alternar o tema.
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');

      // Guarda a preferência do utilizador e atualiza o ícone do botão.
      const isDarkMode = body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      themeToggleButton.textContent = isDarkMode ? '☀️' : '🌙';
    });
  }
});