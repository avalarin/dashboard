# dashboard

## Требования
* cygwin (только под Windows)
* nodejs, npm
* gulp-cli
* bower-cli

## Начало работы
* Инициализация
```
git clone git@github.com:avalarin/dashboard.git
cd dashboard
npm install --save-dev
bower install
```
* Запуск сборки: `gulp`
* Запуск сборки и автоматического отслеживания изменений: `gulp && gulp watch`
* Запуск сервера: `node server/app.js`. Cервер работает на 3000 порту