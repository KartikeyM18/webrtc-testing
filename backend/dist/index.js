"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
let senderSocket2 = null;
let receiverSocket2 = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type === "sender") {
            senderSocket = ws;
            console.log(message);
        }
        else if (message.type === 'receiver') {
            receiverSocket = ws;
            console.log(message);
        }
        else if (message.type === 'createOffer') {
            if (ws !== senderSocket) {
                return;
            }
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
            console.log(message);
        }
        else if (message.type === 'createAnswer') {
            if (ws !== receiverSocket) {
                return;
            }
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
            console.log(message);
        }
        else if (message.type === 'iceCandidate') {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            console.log(message);
        }
        if (message.type === "sender2") {
            senderSocket2 = ws;
            console.log(message);
        }
        else if (message.type === 'receiver2') {
            receiverSocket2 = ws;
            console.log(message);
        }
        else if (message.type === 'createOffer2') {
            if (ws !== senderSocket2) {
                return;
            }
            receiverSocket2 === null || receiverSocket2 === void 0 ? void 0 : receiverSocket2.send(JSON.stringify({ type: 'createOffer2', sdp: message.sdp }));
            console.log(message);
        }
        else if (message.type === 'createAnswer2') {
            if (ws !== receiverSocket2) {
                return;
            }
            senderSocket2 === null || senderSocket2 === void 0 ? void 0 : senderSocket2.send(JSON.stringify({ type: 'createAnswer2', sdp: message.sdp }));
            console.log(message);
        }
        else if (message.type === 'iceCandidate2') {
            if (ws === senderSocket2) {
                receiverSocket2 === null || receiverSocket2 === void 0 ? void 0 : receiverSocket2.send(JSON.stringify({ type: 'iceCandidate2', candidate: message.candidate }));
            }
            else if (ws === receiverSocket2) {
                senderSocket2 === null || senderSocket2 === void 0 ? void 0 : senderSocket2.send(JSON.stringify({ type: 'iceCandidate2', candidate: message.candidate }));
            }
            console.log(message);
        }
    });
});
