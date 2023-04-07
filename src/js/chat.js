import moment from 'moment';

export default class Chat {
  constructor(name, ws) {
    this.name = name;
    this.ws = ws;
    this.body = document.body;
    this.chatContainer = undefined;
    this.usersField = undefined;
    this.listUsers = [];
    this.textField = undefined;
    this.chatForm = undefined;
    this.input = undefined;

    this.chatWidjet = this.chatWidjet.bind(this);
    this.userListWidget = this.userListWidget.bind(this);
    this.deletingUsers = this.deletingUsers.bind(this);
    this.messages = this.messages.bind(this);
    this.messageEror = this.messageEror.bind(this);
    this.messageAddUser = this.messageAddUser.bind(this);
    this.userDisconnectMessage = this.userDisconnectMessage.bind(this);
    this.response = this.response.bind(this);

    this.ws.addEventListener('open', () => {
      console.log('ws open');
    });
    this.ws.addEventListener('error', (e) => {
      console.log('ws error');
      console.log(e);
    });
    this.ws.addEventListener('message', (e) => {
      this.response(e.data);
    });
    this.ws.addEventListener('close', () => {
      console.log('ws close');
      this.messageEror();
    });
  }

  static chatTemplate() {
    return `
    <div class="container">
    <div class="users"></div>
    <div class="chat-window">
      <div class="text-field"></div>
      <form class="chat-form">
        <input type="text" class="to-send" placeholder="Введите текст" required>
      </form>
    </div>
    `;
  }

  chatWidjet() {
    const html = Chat.chatTemplate();
    this.body.insertAdjacentHTML('afterbegin', html);
    this.chatContainer = this.body.querySelector('.container');
    this.usersField = this.chatContainer.querySelector('.users');
    this.textField = this.chatContainer.querySelector('.text-field');
    this.chatForm = this.chatContainer.querySelector('.chat-form');
    this.input = this.chatContainer.querySelector('.to-send');
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.input.value;
      this.ws.send(text);
      this.input.value = '';
    });
  }

  static usersTemplate(id) {
    return `
      <div class="user" id="${id}">
        <div class="user-mark"></div>
        <div class="user-name">${id}</div>
      </div>
    `;
  }

  static messageTemplate(id, text, date, additionalСlass, colors) {
    return `
      <div class="message${additionalСlass}">
        <div class="title${colors}">${id} ${date}</div>
        <div class="text">${text}</div>
      </div>
    `;
  }

  userListWidget() {
    this.listUsers.forEach((el) => {
      const html = Chat.usersTemplate(el);
      this.usersField.insertAdjacentHTML('beforeend', html);
    });
  }

  deletingUsers() {
    const list = Array.from(this.usersField.querySelectorAll('.user'));
    list.forEach((el) => el.remove());
  }

  messages(json) {
    let additionalСlass = '';
    let colors = '';
    const time = Date.now();
    const date = moment(time).format('HH:mm DD.MM.YYYY');
    let { id } = JSON.parse(json);
    const { text } = JSON.parse(json);
    if (this.name === id) {
      id = 'Вы, ';
      additionalСlass = ' right';
      colors = ' red my';
    }
    const html = Chat.messageTemplate(id, text, date, additionalСlass, colors);
    this.textField.insertAdjacentHTML('beforeend', html);
  }

  messageAddUser(id) {
    const title = `${id} присоеденился к чату`;
    const time = Date.now();
    const date = moment(time).format('HH:mm DD.MM.YYYY');
    const html = Chat.messageTemplate(title, '', date, '', ' orange');
    this.textField.insertAdjacentHTML('beforeend', html);
  }

  userDisconnectMessage(id) {
    const title = `${id} покинул чат`;
    const time = Date.now();
    const date = moment(time).format('HH:mm DD.MM.YYYY');
    const html = Chat.messageTemplate(title, '', date, '', ' orange');
    this.textField.insertAdjacentHTML('beforeend', html);
  }

  messageEror() {
    const time = Date.now();
    const date = moment(time).format('HH:mm DD.MM.YYYY');
    const html = `
      <div class="message">
        <div class="title orange">${date}</div>
        <div class="text orange">Сервер прекратил работу</div>
      </div>
    `;
    this.textField.insertAdjacentHTML('beforeend', html);
  }

  response(json) {
    const { status, id } = JSON.parse(json);
    switch (status) {
      case 'add':
        if (!this.listUsers.includes(id)) this.listUsers.push(id);
        this.deletingUsers();
        this.userListWidget();
        this.messageAddUser(id);
        break;
        // return;
      case 'none':
        this.messages(json);
        break;
        // return;
      case 'del':
        this.listUsers = this.listUsers.filter((user) => user !== id);
        this.deletingUsers();
        this.userListWidget();
        this.userDisconnectMessage(id);
        break;
      default:
        return;
    }
    this.textField.scrollTop = this.textField.scrollHeight;
  }
}
