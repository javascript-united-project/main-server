const { Op, fn, col, where, literal } = require("sequelize");

const User = require('../models/User');
const Rank = require("../models/Rank");

const OPTION_QUERY = { returning: true, plain: true };
const { SUBJECT_CODE_RECORDS } = require("../utils/vo");
const DefaultDict = require('../utils/collection');

const getRankBySubject = async (subjectId) => {
  try {
    const ranks = await Rank.findAll({
      where: { subjectId },
      order: [
        ['ranks.correctAnswerRate', 'DESC']
      ],
      limit: 3
    });
    return ranks.map(each => each.dataValues);
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const getQuizRecordByChapter = async (chapterId) => {
  try {
    const users = await User.findAll({      
      attributes: ['quizRecord']
    });
    
    return users.some(each => !each.quizRecord[`${chapterId}`])
      ? undefined
      : users.map((each) => each.quizRecord[`${chapterId}`]);
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const patchQuizRecord = async (username, chapterId, chapterSheet) => {
  try {
    const user = await User.findOne({
      where: { username },
      ...OPTION_QUERY
    });
    user.dataValues.quizRecord[`${chapterId}`] = chapterSheet;

    return await User.update({
      quizRecord: user.dataValues.quizRecord
    }, {
      where: { username },
      ...OPTION_QUERY
    });
  } catch (err) {
    return Promise.reject(err.message);
  }
}

const patchSubjectRank = async (name, subjectId, totalPercentage) => {
  try {
    const findableQuery = { [Op.and]: [{ subjectId }, { ['ranks.name']: name }] };

    const updatableQuery = {
      subjectId,
      ['ranks.name']: name,
      ['ranks.correctAnswerRate']: totalPercentage
    };

    const updateOrCreate = async _ => {
      const target = await Rank.findOne({
        where: findableQuery
      });
      if (!target)
        return await Rank.create(updatableQuery,
          { ...OPTION_QUERY });

      return await Rank.update(updatableQuery,
        {
          where: findableQuery,
          ...OPTION_QUERY
        });
    }
    return await updateOrCreate();
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const getScorePercentage = (user, subjectId) => Object.entries(user.quizRecord)
  .filter(([chapterId, _]) => chapterId.substring(0, 2) === subjectId
  )
  .map(([_, chapterRecord]) =>
    chapterRecord
      .filter(each => each).length / chapterRecord.length
  )
  .reduce((acc, cur) => acc += cur, 0);

const getScore = (quizRecord) => {
  const result = new DefaultDict(_ => []);
  for (const [chapterId, chapterRecord] of Object.entries(quizRecord)) {
    const subjectTitle = SUBJECT_CODE_RECORDS[chapterId.match(/^.[^_]/)];
    result[subjectTitle].push({
      "chapterId": parseInt(chapterId.match(/[1-9][0-9]*/)),
      "detail": {
        "score": chapterRecord.filter(each => each === true).length + "/" + chapterRecord.length,
        "state":
          chapterRecord.some(each => each === null)
            ? "proceed" : "end"
      }
    })
    result[subjectTitle].sort((a, b) =>
      (a.chapterId > b.chapterId) ? 1
        : (b.chapterId > a.chapterId) ? -1
          : 0);
  }
  return result;
};

module.exports = {
  getRankBySubject,
  getQuizRecordByChapter,
  patchQuizRecord,
  patchSubjectRank,
  getScorePercentage,
  getScore
};