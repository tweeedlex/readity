const { Configuration, OpenAIApi } = require("openai");
const models = require("../models");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const saveText = async (data, theme, size, language) => {
  const text = await models.Text.create({
    text: data.text,
    theme,
    size,
    language,
  });
  await models.Questions.create({ questions: data.questions, textId: text.id });
  return text.id;
};

const checkIfExists = async (theme, size, language) => {
  const text = await models.Text.findOne({ where: { theme, size, language } });

  if (text) {
    const questions = await models.Questions.findOne({
      where: { textId: text.id },
    });
    return { text: text.text, questions: questions.questions, id: text.id };
  }
  return null;
};

class TextController {
  async getRandomTheme(req, res) {
    try {
      const themes = await models.Text.findAll({ attributes: ["theme"] });
      const randomTheme =
        themes[Math.floor(Math.random() * themes.length)].theme;
      return res.status(200).json({ theme: randomTheme });
    } catch (e) {
      console.log(e);
    }
  }

  async getText(req, res) {
    try {
      let { theme, questions, answers, size, language } = req.body;
      size = size || "short";
      theme = theme || "Apple";
      language = language || "English";
      questions = questions || 4;
      answers = answers || 4;

      checkIfExists(theme, size, language).then((data) => {
        if (data) {
          return res.status(200).json(data);
        }
      });

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 3000,
        temperature: 0.2,
        top_p: 0.95,
        messages: [
          {
            role: "user",
            content: `
            Create a JSON object that includes a ${size} article or essay about ${theme}. 
            Place it in the "text" property of the JSON object.
            The JSON object should also include ${questions} questions, each with ${answers} answer variants, where only one answer is correct. 
            Place answers for each question in array "answers", and place text of each answer with key "answer".
            Please indicate the correct answer with an "isRight" value. 
            The entire JSON object should be formatted so that it can be easily parsed with the JSON.parse() method. 
            Do not use quotes(") in the text of the article, questions, or answers.
            Write all in ${language} language.
    
            Example of a JSON object with one question and four answers, where only one answer is correct:
            {
              "text": "This is an article about Apple.",
              "questions": [
                {
                  "question": "What is the name of the company?",
                  "answers": [
                    {
                      "answer": "Apple",
                      "isRight": true
                    },
                    {
                      "answer": "Microsoft",
                      "isRight": false
                    },
                    {
                      "answer": "Google",
                      "isRight": false
                    },
                    {
                      "answer": "Samsung",
                      "isRight": false
                    }
                  ]
                }
              ]
            }
          `,
          },
        ],
      });

      console.log(completion.data.choices[0].message.content);

      const data = JSON.parse(completion.data.choices[0].message.content);
      const id = await saveText(data, theme, size, language);
      data.id = id;
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new TextController();
