# SmartHome2 - Simulação de Casa Inteligente - Projeto IoT

![alt text](<Casa Inteligente-1.PNG>)

Um projeto de simulação de uma casa inteligente que permite controlar múltiplos dispositivos em tempo real através de uma interface web. A comunicação é feita com Node.js e Socket.io, garantindo que todas as interfaces conectadas estejam sempre sincronizadas.

---

## ✨ Funcionalidades

-   **Controlo em Tempo Real:** Altere o estado dos dispositivos e veja a atualização instantaneamente em todos os ecrãs abertos.
-   **Painel de Controlo Centralizado:** Uma única página (`painel.html`) para visualizar e controlar todos os dispositivos.
-   **Páginas de Dispositivo Individuais:** Cada dispositivo tem a sua própria página de estado.
-   **Sincronização de Clientes:** O servidor atua como a "fonte da verdade", mantendo todos os clientes sincronizados.
-   **Tema Escuro/Claro:** Alterne entre os temas claro e escuro. A sua preferência é guardada no `localStorage` do navegador.

### Dispositivos Implementados
-   **📱 Telemóvel:** Ligar e desligar a lanterna.
-   **☕ Máquina de Café:** Iniciar o preparo do café (com estados "a preparar" e "pronto") e desligar.
-   **❄️ Ar Condicionado:** Ligar/desligar e ajustar a temperatura com um slider.

---

## 🛠️ Tecnologias Utilizadas

-   **Backend:**
    -   Node.js
    -   Express - Para servir os ficheiros estáticos e estruturar o servidor.
    -   Socket.io - Para a comunicação bidirecional e em tempo real.
-   **Frontend:**
    -   HTML5
    -   CSS3
    -   JavaScript

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar o projeto localmente.

1.  **Clone o repositório:**

    git clone https://github.com/JuniorprogrammerCV/SmartHome2.git

    cd SmartHome2


2.  **Instale as dependências:**
    (Certifique-se de ter o Node.js e o npm instalados)

    npm install


3.  **Inicie o servidor:**

    node server.js


4.  **Aceda à aplicação:**
    Abra o seu navegador e aceda ao seguintes URL:

    -   **Painel de Controlo:** http://localhost:3000/painel.html


---

## 📂 Estrutura do Projeto

```
/
├── .gitignore          # Ignora a pasta node_modules
├── package-lock.json   # Garante versões exatas das dependências
├── package.json        # Dependências e scripts do projeto
├── server.js           # Servidor backend (Express + Socket.io)
└── public/             # Ficheiros do frontend
    ├── painel.html     # Painel de controlo principal
    ├── ac.html         # Páginas de estado individuais...
    ├── maquina_cafe.html
    ├── telemovel.html
    ├── script.js       # Lógica do cliente (UI e comunicação)
    └── style.css       # Estilos da aplicação
```

### Como Funciona a Comunicação

1.  O **`server.js`** mantém um objeto `deviceStates` que representa o estado atual de todos os dispositivos.
2.  Quando um cliente (navegador) se conecta, o servidor envia-lhe o estado inicial de todos os dispositivos (`initial_states`).
3.  Quando um utilizador interage com a interface (ex: clica num botão), o `script.js` emite um evento `control_device` para o servidor com os detalhes da ação.
4.  O servidor recebe o comando, atualiza o estado do dispositivo correspondente no objeto `deviceStates`.
5.  Após a atualização, o servidor emite um evento `state_changed` para **todos** os clientes conectados, enviando o novo estado.
6.  Cada cliente recebe este evento e atualiza a sua interface de acordo com os novos dados, garantindo a sincronização.

---
_Projeto desenvolvido por Junior Delgado._
