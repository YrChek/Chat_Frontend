import Regist from './registration';
import Chat from './chat';

document.addEventListener('DOMContentLoaded', () => {
  const regist = new Regist();
  const formRegist = regist.startWidjet();

  async function registrationRequest(e) {
    e.preventDefault();
    const nik = regist.input.value;
    const param = encodeURIComponent(nik);
    let response;
    try {
      response = await fetch(`https://my-first-chat.onrender.com/registration/?name=${param}`);
    } catch (error) {
      regist.error.textContent = 'Нет связи с сервером';
    }

    if (!response.ok) {
      regist.input.style.color = 'red';
      regist.error.textContent = await response.text();
      return;
    }

    const ws = new WebSocket('ws://my-first-chat.onrender.com/app');
    const listUsers = await response.json();
    regist.widjet.remove();
    const chat = new Chat(nik, ws);
    chat.listUsers = listUsers;
    chat.chatWidjet();
  }

  formRegist.addEventListener('submit', registrationRequest);
  regist.input.addEventListener('input', () => {
    regist.input.style.color = '';
    regist.error.textContent = '';
  });
});
