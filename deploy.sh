# Сменить Docker-контекст на клиентский
docker context use default

# Собрать Docker-образ
docker build -t skyferry/messenger .

# Сохранить образ в файл
docker save skyferry/messenger | gzip > docker-image.tar.gz

# Сменить Docker-контекст на соответствующий серверу
docker context use $1

# Загрузить Docker-образ из файла
docker load -i docker-image.tar.gz

# Запустить контейнер
docker run -p 5000:5000 -d --env \
  MONGO_URL="$2" \
  skyferry/messenger