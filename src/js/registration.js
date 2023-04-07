export default class Regist {
  constructor() {
    this.body = document.body;
    this.widjet = undefined;
    this.error = '';
    this.input = undefined;

    this.startWidjet = this.startWidjet.bind(this);
  }

  static registrationTemplate() {
    return `
    <div class="registration">
      <p>Выберите псевдоним</p>
      <form class="form">
        <input type="text" class="registration-form" required>
        <div class="error"></div>
        <button class="registration-button">Продолжить</button>
      </form>
  </div>
    `;
  }

  startWidjet() {
    const html = Regist.registrationTemplate();
    this.body.insertAdjacentHTML('afterbegin', html);
    this.widjet = document.querySelector('.registration');
    this.error = document.querySelector('.error');
    this.input = document.querySelector('.registration-form');
    return document.querySelector('.form');
  }
}
