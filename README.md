Подготовка среды:
```
# Установка утилит gulp и bower, -g значит установить глобально, а не для текущего проекта
npm install -g gulp-cli bower
# Установка зависимостей для текущего проекта, зависимости устанавливаются в project.json
npm install --save-dev
# Установка js библиотек по списку из bower.json
bower install
# Запуск сборки и запуск отслеживания изменений
gulp & gulp watch
```