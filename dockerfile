# Node.js 공식 이미지 기반 (LTS 버전)
FROM node:20-alpine

# 작업 디렉토리 생성
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install

# 프로젝트 전체 소스 복사
COPY . .

# 애플리케이션이 실행될 포트 노출
# EXPOSE 6666

# 애플리케이션 실행 커맨드
CMD ["node", "game/src/server.js"]