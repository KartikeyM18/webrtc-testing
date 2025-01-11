import { useEffect } from "react";

export default function Receiver() {

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'receiver'
      }));
    }
    startReceiving(socket);
  }, []);

  function startReceiving(socket: WebSocket) {
    const pc = new RTCPeerConnection();
    console.log("started");

    socket.onmessage = async (event) => {
      console.log("got message");
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "createOffer") {
        await pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({
          type: 'createAnswer',
          sdp: answer
        }));
      } else if (message.type === 'iceCandidate') {
        pc.addIceCandidate(message.candidate);
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(JSON.stringify({
          type: 'iceCandidate',
          candidate: event.candidate
        }));
      }
    }

    const video = document.createElement('video');
    document.body.appendChild(video);
    // video.autoplay = true;
    pc.ontrack = (event) => {
      video.srcObject = new MediaStream([event.track]);
      video.play();
    }
  }




  return (
    <div>
      Receiver
    </div>
  )
}
