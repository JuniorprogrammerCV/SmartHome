const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

// O servidor é a "fonte da verdade" para o estado dos dispositivos.
let deviceStates = {
  telemovel: { lanterna: 'desligada' },
  maquina_cafe: { estado: 'desligada' },
  ac: { estado: 'desligado', temperatura: 22 },
};

// Servir ficheiros estáticos da pasta 'public'
app.use(express.static('public'));

// Lógica de comunicação com Socket.io
io.on('connection', (socket) => {
  console.log('Um novo utilizador conectou-se!');

  // Envia o estado inicial para o cliente recém-conectado.
  socket.emit('initial_states', deviceStates);

  // Centraliza a lógica de controlo de cada dispositivo.
  const deviceHandlers = {
    telemovel: (command) => {
      deviceStates.telemovel.lanterna = command === 'ligar' ? 'ligada' : 'desligada';
    },
    maquina_cafe: (command) => {
      // Lógica de estados para a máquina de café
      if (command === 'ligar' && deviceStates.maquina_cafe.estado === 'desligada') {
        deviceStates.maquina_cafe.estado = 'a preparar';
        // Emite imediatamente a mudança para 'a preparar'
        io.emit('state_changed', { device: 'maquina_cafe', states: deviceStates });

        // Agenda a mudança para 'pronto' após 4 segundos.
        setTimeout(() => {
          // Apenas conclui se o processo não foi cancelado manualmente.
          if (deviceStates.maquina_cafe.estado === 'a preparar') {
            deviceStates.maquina_cafe.estado = 'pronto';
            io.emit('state_changed', { device: 'maquina_cafe', states: deviceStates });
          }
        }, 4000); // 4 segundos para preparar
        return; // Retorna para não emitir o evento 'state_changed' duplicado no final
      } else if (command === 'desligar') {
        deviceStates.maquina_cafe.estado = 'desligada';
      }
    },
    ac: (command, value) => {
      if (command === 'ligar_desligar') {
        deviceStates.ac.estado = deviceStates.ac.estado === 'ligado' ? 'desligado' : 'ligado';
      } else if (command === 'set_temperatura') {
        deviceStates.ac.temperatura = value;
      }
    }
  };

  // Ouve os comandos enviados pelo cliente.
  socket.on('control_device', (data) => {
    console.log('Comando recebido:', data);

    // Verifica se existe um handler para o dispositivo recebido
    if (deviceHandlers[data.device]) {
      deviceHandlers[data.device](data.command, data.value);
      // Envia a atualização para todos os clientes (exceto para a lógica assíncrona do café)
      io.emit('state_changed', { device: data.device, states: deviceStates });
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilizador desconectou-se.');
  });
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor a rodar em http://localhost:${PORT}/painel.html`);
});