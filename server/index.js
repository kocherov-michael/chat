const WebSocket = require('ws');
// const fs = require('fs')
// const http = require("http");
const express = require('express')
const path = require('path')
// const host = 'localhost';
// const port = 8000;

// const requestListener = function (req, res) {
//     res.setHeader("Content-Type", "application/json");
//     res.writeHead(200);
//     res.end(`{"message": "This is a JSON response"}`);
// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });

const app = express()
const port = process.env.PORT || 8081
// app.use('/assets', express.static(path.join(__dirname, '../../dist/client')))
//     .use('/public', express.static(path.join(__dirname, '../../public')))
// app.use(bodyParser.json())
console.log(__dirname, '../client/build')
console.log(path.join(__dirname, '../client/build'))
// console.log(express.static(path.join(__dirname, '../client/build')))

app.use('/', express.static(path.join(__dirname, '../client/build')))
app.use('/chat', express.static(path.join(__dirname, '../client/build')))
app.use('/login', express.static(path.join(__dirname, '../client/build')))
app.listen(port, () => {
    console.log(`Listening port: ${port}`)
})



const wsServer = new WebSocket.Server({port: 9000});

wsServer.on('connection', onConnect);

const clients = {}
let users = []

// fs.access("usersFile.txt", function(error){
//   if (error) {
//       console.log("Файл не найден");
//       fileHandler()
//   } else {
//       console.log("Файл найден");
//   }
// });

// function fileHandler() {
//   fs.open('usersFile.txt', 'w', (err) => {
//     if (err) throw err;
//     console.log('file created')
//   })
// }

function fileRead(callback) {
  callback(users)
  // fs.readFile('usersFile.txt', 'utf8', (err, data) => {
  //   if (err) throw err
  //   let parsedData
  //   try {
  //     parsedData = JSON.parse(data)
  //   } catch (e) {
  //     console.log(e)
  //   }
  //   callback(parsedData)
  // })
}
function fileWrite(data) {
  users = [...data]
  // fs.writeFile('usersFile.txt', JSON.stringify(data), (err) => {
  //   if (err) throw err

  //   console.log('Saved')
  // })
}

function onConnect(wsClient) {
  let user = null
    // отправка приветственного сообщения клиенту
    wsClient.send(JSON.stringify('подключение успешно'));
    wsClient.on('message', function(message) {
        try {
          // сообщение пришло текстом, нужно конвертировать в JSON-формат
            const jsonMessage = JSON.parse(message);
            console.log('jsonMessage:',jsonMessage)
            switch (jsonMessage.action) {
              case 'auth':
                fileRead((users = []) => {
                  let msg = 'Добавлен новый пользователь'
                  let status = false
                  const authorazedUser = users?.find(user => user.login === jsonMessage.login)
                  if (authorazedUser) {
                    if (authorazedUser.password === jsonMessage.password) {
                      user = authorazedUser.login
                      msg = 'Успешная авторизация'
                      clients[jsonMessage.login] = wsClient
                      status = true
                    } else {
                      msg = 'пароль не совпадает'
                      wsClient.send(JSON.stringify({ type: 'alert', message: 'Пользователь существует и пароль не совпадает' }));
                    }
                  } else if (jsonMessage.login) {
                    users.push({login: jsonMessage.login, password: jsonMessage.password})
                    user = jsonMessage.login
                    clients[jsonMessage.login] = wsClient
                    fileWrite(users)
                    status = true
                  } else {
                    msg = 'не идентифицировано'
                  }
                  wsClient.send(JSON.stringify(
                    {
                      type: 'auth',
                      message: msg,
                      login: jsonMessage.login,
                      status
                    }
                  ));
                })
                break;
              case 'msg':
                  if (user) {
                    if (jsonMessage.to) {
                      try {
                        if (clients[jsonMessage.to]) {

                          clients[jsonMessage.to].send(JSON.stringify(
                            {
                              type: 'msg',
                              from: user,
                              message: jsonMessage.message,
                            }
                          ));
                        } else {
                          wsClient.send(JSON.stringify({ type: 'alert', message: 'получатель оффлайн' }));
                        }
                      } catch (e) {
                        console.log(e)
                        wsClient.send(JSON.stringify({ type: 'alert', message: 'не получается' }));
                      }
                    } else {
                      wsClient.send(JSON.stringify({ type: 'alert', message: 'кому?' }));
                    }
                  } else {
                    wsClient.send(JSON.stringify({ type: 'alert', message: 'авторизуйтесь' }));
                  }
              break;
              default:
                console.log('Неизвестная команда');
                break;
            }
        } catch (error) {
        console.log('Ошибка', error);
        }
    })
    wsClient.on('close', function() {
      // отправка уведомления в консоль
      console.log('Пользователь отключился');
    })
  }