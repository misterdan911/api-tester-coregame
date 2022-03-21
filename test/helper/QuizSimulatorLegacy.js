const config = require('config');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

class QuizSimulator {

  constructor() {
    this.totalPlay = 0;
    this.msisdn = '';
    this.quizType = 'random';
    this.chosenAnswerType = 'random'; // random, always_true
  }

  setConfig(config) {
    // random or predetermined
    this.msisdn = config.msisdn;

    if (config.quizType) {
      this.quizType = config.quizType;
    }
    
    if (config.chosenAnswerType) {
      this.chosenAnswerType = config.chosenAnswerType;
    }

    if (config.stopAtTotalPlay) {
      this.stopAtTotalPlay = config.stopAtTotalPlay;
    }
  }

  getQuizType() {
    const typeQuiz = [];

    typeQuiz[1] = 'gambar';
    typeQuiz[2] = 'lyric';
    // typeQuiz[3] = 'judul';

    if (this.quizType == 'random') {
      return typeQuiz[this.getRandomInt(2)];
    }

    if (typeQuiz.includes(this.quizType)) {
      return this.quizType;
    }
    else {
      throw new Error('Invalid quizType!');
    }
  }

  async run() {
    this.totalPlay = 0;

    let quizType = this.getQuizType();

    let resBody = await this.getQuestion(quizType);
    // console.log('resBody', resBody);

    if (resBody.code == 300) { return this.totalPlay; }

    let questionText = this.getQuestionText(resBody);
    let questionId = resBody.data[0].question_id;

    let answerData = this.choseAnswerId(resBody.data[0].options);
    let chosenAnswerId = answerData.answerId;
    let chosenAnswerText = answerData.answerText;

    resBody = await this.answerAndGetNextQuestion(this.msisdn, quizType, questionId, chosenAnswerId);

    console.log('--------------------------');
    console.log('QType:', quizType);
    console.log('Q:', questionText);
    console.log('A:', chosenAnswerText);
    console.log('--------------------------');


    this.totalPlay++;

    while (resBody.code == 200) {
      let nextQuizType = this.getQuizType();

      if (quizType != nextQuizType) {
        quizType = nextQuizType;
        resBody = await this.getQuestion(quizType);
      }

      // resBody = await this.getQuestion(quizType);
      questionText = this.getQuestionText(resBody);
      questionId = resBody.data[0].question_id;

      answerData = this.choseAnswerId(resBody.data[0].options);
      chosenAnswerId = answerData.answerId;
      chosenAnswerText = answerData.answerText;

      resBody = await this.answerAndGetNextQuestion(this.msisdn, quizType, questionId, chosenAnswerId);

      if (resBody.code == 300) { return this.totalPlay; }

      console.log('--------------------------');
      console.log('QType:', quizType);
      console.log('Q:', questionText);
      console.log('A:', chosenAnswerText);
      console.log('--------------------------');

      this.totalPlay++;

      // Stop quiz at certain total play
      // ----------------------------------------------------
      if (this.stopAtTotalPlay) {
        if (this.totalPlay == this.stopAtTotalPlay) {
          break;
        }
      }
      // ----------------------------------------------------


    }

    return this.totalPlay;
  }

  async getQuestion(quizType) {
    let data = {
      msisdn: this.msisdn,
      type: quizType
    };

    return await this.hitQuestionApi(data);
  }

  async answerAndGetNextQuestion(msisdn, quizType, questionId, answerId) {
    let data = {
      msisdn: msisdn,
      type: quizType,
      question_id: questionId,
      answer: answerId,
    };

    return await this.hitQuestionApi(data);
  }

  async hitQuestionApi(data) {
    let res = await chai.request(config.backendUrl)
      .post('/quiz/question')
      .send(data)
      .catch(err => { throw err; });

    return res.body;
  }

  getRandomInt(maxRange) {
    return Math.floor(Math.random() * maxRange) + 1;
  }

  getQuestionText(resBody) {
    let questionText;

    if (resBody.data[0].q_image.trim() != '') {
      questionText = resBody.data[0].q_image;
    } else {
      questionText = resBody.data[0].q_text;
    }

    return questionText;
  }

  choseAnswerId(opt) {
    let arrAnswerId = [];
    let arrAnswerText = [];

    arrAnswerId[1] = opt[0].id;
    arrAnswerId[2] = opt[1].id;
    arrAnswerId[3] = opt[2].id;
    arrAnswerId[4] = opt[3].id;

    arrAnswerText[1] = opt[0].option;
    arrAnswerText[2] = opt[1].option;
    arrAnswerText[3] = opt[2].option;
    arrAnswerText[4] = opt[3].option;

    let chosenIndex;

    if (this.chosenAnswerType == 'random') {
      chosenIndex = this.getRandomInt(4);
    }
    else if (this.chosenAnswerType == 'always_true') {
      opt.forEach( (item, itemIndex) => {
        if (item.is_true == true) {
          chosenIndex = itemIndex + 1;
        }
      });
    }
    else {
      throw new Error('Invalid chosenAnswerType!');
    }

    let data = {
      answerId: arrAnswerId[chosenIndex],
      answerText: arrAnswerText[chosenIndex],
    };

    return data;
  }

}

module.exports = QuizSimulator;
