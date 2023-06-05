const models = require("../models");

class UserController {
  async createUser(req, res) {
    try {
      const { email, uid } = req.body;

      const userCandidate = await models.User.findOne({ where: { email } });
      if (userCandidate) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await models.User.create({ email, uid });
      return res.status(200).json({ message: "User created" });
    } catch (e) {
      console.log(e);
    }
  }

  async createStats(req, res) {
    try {
      const { wpm, comprehension, textId, email } = req.body;
      const user = await models.User.findOne({ where: { email } });
      const userId = user.id;
      const stats = await models.UserStats.create({
        wpm,
        comprehension,
        textId,
        userId,
      });
      return res.status(200).json({ message: "Stats created" });
    } catch (e) {
      console.log(e);
    }
  }

  async getStats(req, res) {
    try {
      const { uid } = req.query;
      const user = await models.User.findOne({ where: { uid } });
      const userId = user.id;
      const stats = await models.UserStats.findAll({ where: { userId } });

      const averageWPM = Math.round(
        stats.reduce((acc, stat) => acc + stat.wpm, 0) / stats.length
      );
      const averageComprehension = Math.round(
        stats.reduce((acc, stat) => acc + stat.comprehension, 0) / stats.length
      );
      const themes = stats.map((stat) => stat.textId);
      const favouriteThemeId = themes
        .sort(
          (a, b) =>
            themes.filter((v) => v === a).length -
            themes.filter((v) => v === b).length
        )
        .pop();
      const {theme: favouriteTheme} = await models.Text.findOne({
        where: { id: favouriteThemeId },
      });
      const testsCompleted = stats.length;
      const maxComprehentionResults = stats.filter(
        (stat) => stat.comprehension === 100
      );
      const bestWPMWithMaxComprehension = Math.round(
        maxComprehentionResults.reduce((acc, stat) => acc + stat.wpm, 0) /
          maxComprehentionResults.length
      );

      const result = {
        averageWPM,
        averageComprehension,
        favouriteTheme,
        testsCompleted,
        bestWPMWithMaxComprehension,
        stats
      };

      return res.status(200).json({ result });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UserController();
