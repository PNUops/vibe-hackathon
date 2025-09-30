# Node.js 공식 이미지를 기반으로 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 3000 포트 노출
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "run", "dev"]