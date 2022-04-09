# 💬 КоРпОрАтИвНыЙ МеСсЕнДжЕр 💬

## Инструкция для разработчиков:

Склонировать репозиторий:

```bash
git clone https://github.com/SkyFerry17/messenger.git
```

Перейти в папку с репозиторием:

```bash
cd messenger
```

Установить зависимости:

```bash
npm i
```

Запустить dev-сервер фронтенда:

```bash
npm start
```

В отдельном терминале запустить бэкенд-сервер:

```bash
FRONTEND=dev \
MONGO_URL="mongodb+srv://..." \
npm run serve-dev
```

Запущенный проект будет обновляться автоматически при изменениях в исходниках. 

## Инструкция для админов сервиса (с докером):

Склонировать репозиторий:

```bash
git clone https://github.com/SkyFerry17/messenger.git
```

Перейти в папку с репозиторием:

```bash
cd messenger
```

Собрать Docker-образ:

```bash
docker build -t skyferry/messenger .
```

Сохранить образ в файл:

```bash
docker save -o docker-image.tar skyferry/messenger
```

Или:

```bash
docker save skyferry/messenger | gzip > docker-image.tar.gz
```

Сменить Docker-контекст на соответствующий серверу:

```bash
docker context use your-context
```

Загрузить Docker-образ из файла:

```bash
docker load -i docker-image.tar
```

Или:

```bash
docker load -i docker-image.tar.gz
```

Запустить контейнер:

```bash
docker run -p 5000:5000 -d --env \
MONGO_URL="mongodb+srv://..." \
skyferry/messenger
```

## Инструкция для админов сервиса (без докера):

Склонировать репозиторий:

```bash
git clone https://github.com/SkyFerry17/messenger.git
```

Перейти в папку с репозиторием:

```bash
cd messenger
```

Установить зависимости:

```bash
npm i
```

Выполнить сборку фронтенда:

```bash
npm run build
```

Собрать и запустить бэкенд:

```bash
MONGO_URL="mongodb+srv://..." \
npm run serve
```

## Используемые технологии

1. `HTTP` — протокол передачи гипертекста поверх TCP по схеме запрос-ответ;
2. `WebSockets` — протокол связи поверх TCP, предназначенный для двухстороннего обмена сообщениями между браузером и веб-сервером в режиме реального времени, можно сравнить с техникой long polling;
3. `TypeScript` — надмножество JS со строгой типизацией и статической проверкой типов, можно сравнить с Flow или Dart;
4. `StandardJS`, а точнее `ts-standard` приятный глазу стандaрт кодирования на JS|TS, имеющий поддерживающие линтеры и средства автоформатирования;
5. `Node.js` — JS-рантайм для сервера, сравним с Deno;
6. `Express.js` — быстрый и удобный веб-сервер для Node.js;
7. `MongoDB` — документоориентированная высокопроизводительная и масштабируемая NoSQL СУБД;
7. `Docker` — программное обеспечение для автоматизации развертывания и управления приложениями в средах с поддержкой контейнеризации;
8. `MikroORM` — ORM для TypeScript, использующая рефлексию на декораторах для упрощения разработки, можно сравнить с TypeORM и Mongoose;
9. `React.js` — библиотека для отрисовки сложных компонентов в браузере;
10. `Redux` — библиотека для управления состоянием приложения;
11. `styled-components` — библиотека для работы с динамическим css-in-js 💅🏾💅🏾💅🏾;
12. `react-redux` — библиотека для связи React и Redux;
13. `React Router` — библиотека для маршрутизации компонентов в React;
14. `connected-react-router` — библиотека для связи React Router и Redux.

## База данных

### Коллекции

1. `User` — пользователи:
    1. `username` — *string*;
    2. `email` — *string*;
    3. `passwordHash` — *string* — bcrypt-хеш пароля;
    4. `firstName` — *string*;
    5. `lastName` — *string*;
    6. `tokens` — *Token[]*;
    7. `chats` — *Chat[]*;
    8. `todos` — *Todo[]*;
    9. `avatar` — *BLOB?*;
    10. `lastSeen` — *Date*;
2. `Token` — токены доступа:
    1. `user` — *User*;
    2. `token` — *string* — сам токен;
    3. `issued` — *Date* — дата выдачи;
    4. `userAgent` — *string* — описание приложения-клиента;
3. `Chat` — диалоги:
    1. `direct` — *boolean* — является ли личкой;
    2. `members` — *User[]*;
    3. `messages` — *Message[]*;
    4. `attachments` — *File[]*;
    5. `todos` — *Todo[]*;
    6. `title` — *string?*;
    7. `avatar` — *BLOB?*;
4. `Message` — сообщения:
    1. `chat` — *Chat*;
    2. `date` — *Date*;
    3. `sender` — *User*;
    4. `type` — *enum MessageType*:
        1. `DEFAULT` — обычное сообщение с текстом или вложениями;
        2. `CREATED` — сервисное сообщение создания чата: «X created the chat»;
        3. `JOINED` — сервисное сообщение добавления в чат: «X joined the chat»;
        4. `LEFT` — сервисное сообщение выхода из чата: «X left the chat;
    5. `attachments` — *File[]*;
    6. `text` — *string?*;
    7. `readBy` — *User[]*
5. `Todo` — задача в чате:
    1. `chat` — *Chat*;
    2. `title` — *string*;
    3. `description` — *string?*;
    4. `assigned` — *User?*;
    5. `completed` — *boolean*;
6. `File` — файл:
    1. `title` — *string*;
    2. `type` — *enum FileType*:
        1. `GENERIC` — обычный файл;
        2. `IMAGE` — изображение;
    3. `owner` — *User*;
    4. `uploaded` — *Date* — дата загрузки;
    5. `body` — *BLOB*.

### Отношения между коллекциями

* `User` —
    - `Token`: *1-n* — пользователь имеет токены;
    - `Chat`: *n-n* — пользователи состоят в чатах;
    - `Message`: *1-n* — пользователь отправил сообщения;
    - `Todo`: *1-n* — пользователи имеют задачи;
    - `File`: *1-n* — пользователь загрузил файлы;
* `Token` —
    - `User`: *n-1* — токен выдан пользователю;
* `Chat` —
    - `User`: *n-n* — чаты содержат участников;
    - `Message`: *1-n* — чат содержит сообщения;
    - `Todo`: *1-n* — чат содержит задачи;
    - `File`: *n-n* — в чатах есть вложения;
* `Message` —
    - `User`: *n-1* — сообщения отправлены [одним] пользователем;
    - `User`: *n-n* — сообщения прочитаны пользователями;
    - `Chat`: *n-1* — сообщения отправлены в чат;
    - `File`: *1-n* — у сообщения есть вложения;
* `Todo` —
    - `User`: *n-1* — задачи назначены пользователю;
    - `Chat`: *n-1* — задачи находятся в чате;
* `File` —
    - `User`: *n-1* — файлы загружены пользователем;
    - `Message`: *n-1* — файлы приложены к сообщению;
