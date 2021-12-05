const express = require('express');

const logger = require('./log')

require('dotenv/config');
const { sequelize } = require('./models');
const { PORT } = process.env;

const app = express();
app.set('trust proxy', 1);

sequelize.sync({ force: false })
	.then(_ => logger.info("데이터베이스 연결 성공"))
	.catch(err => logger.error(err));

app.use(
	require('./middleware/morgan'),
	express.json(),
	express.urlencoded({ extended: false }),
	require('./middleware/cors'),
	require('./middleware/session')
);
app.use('/user', require('./routes/user'));
app.use('/quiz', require('./routes/quiz'));
app.use('/score', require('./routes/score'));
app.use('/search', require('./routes/search'));

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
})
app.use((err, req, res, next) => logger.error(err.message));

app.listen(PORT, _ => logger.info(`app listening on port ${PORT}!`));