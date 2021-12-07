# 재학생들의 강의 기출문제 웹사이트

## 제약사항

- 검색 기능은 서버 호스팅의 결함으로 **주중 9 - 17시**까지만 이용가능합니다.
- 채팅 기능은 별도의 애플리케이션으로 이번 프로젝트 평가 대상에는 제외되지만, 링크에서 다운 받으실 수 있습니다. [채팅 애플리케이션](https://github.com/javascript-unitied-project/chat-server)
- 스토리지는 서버 호스팅 이후 네트워크 결함으로 이용이 불가하여, 로컬 환경 구축 양해 부탁드립니다. [PSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

    스토리지 설정은 `/server/config/config.json`을 확인해주세요.

## Client Setup

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

```bash
# Install dependencies (only the first time)
cd client && npm install

# Run the local server at localhost:3000
npm run start
```

## Server Setup

Download [Node.js](https://nodejs.org/en/download/).

```bash
# Install dependencies (only the first time)
cd server && npm install

# Run the local server at localhost:5000
npm run start
```

> [이슈 문의](https://github.com/javascript-unitied-project/main-server)
