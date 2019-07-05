import socketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import {
  JWT_SECRET
} from '../../config/jsonwebtoken';
let ONLINE = [];
let users = [];

function configSocket(http) {
  const io = socketIo(http);
  io.use((socket, next) => {
    const {
      token
    } = socket.handshake.query;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const check = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true
    });


    if (check) {
      return next();
    }
    return next(new Error('Authentication error'));
  });
  io.of('/').on('connection', (socket) => {
    const {
      token
    } = socket.handshake.query;
    const check = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true
    });

    const {
      id, type
    } = check.user
    
    if (users.includes(id)) {
      let countExisted = 0
      ONLINE.forEach((e, idx) => {
        if (e.id == id && e.type == type) {
            e.count += 1
            countExisted = 1
        }
      });
      if(countExisted == 0) {
        ONLINE.push({
          id,
          type,
          count: 1
        })
      }
    } else {
      users.push(id)
      ONLINE.push({
        id,
        type,
        count: 1
      })
    }
    console.log(ONLINE);
    console.log("==========")
    socket.on('disconnect', () => {
      ONLINE.forEach((e, idx) => {
        if (e.id == id && e.type == type) {
          e.count -= 1
        }
      });

      ONLINE.forEach((element, idx) => {
        if (element.count == 0) {
          console.log("user " +
            element.id + " has disconnected");
          ONLINE.splice(idx, 1)
        }
      });
      console.log(ONLINE);
      console.log("*******************");
      
    })




  })

}

export default configSocket;