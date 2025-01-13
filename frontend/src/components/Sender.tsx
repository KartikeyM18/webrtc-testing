import { useEffect, useState } from "react";

export default function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socket2, setSocket2] = useState<WebSocket | null>(null);


  useEffect(() => {
    // const socket = new WebSocket(import.meta.env.WEBSOCKET_SERVER || "");
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'sender'
      }));

    }
    // const socket2 = new WebSocket(import.meta.env.WEBSOCKET_SERVER || "");
    const socket2 = new WebSocket("ws://localhost:8080");
    setSocket2(socket2);
    socket2.onopen = ()=>{
      socket2.send(JSON.stringify({
        type: 'receiver2'
      }));
    }

    startReceiving(socket2);
  }, []);

  function startReceiving(socket: WebSocket) {
    const pc = new RTCPeerConnection();
    console.log("started");

    socket.onmessage = async (event) => {
      console.log("got message");
      const message = JSON.parse(event.data);
      console.log("inside receiver2");
      console.log(message);
      if (message.type === "createOffer2") {
        await pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({
          type: 'createAnswer2',
          sdp: answer
        }));
      } else if (message.type === 'iceCandidate2') {
        pc.addIceCandidate(message.candidate);
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(JSON.stringify({
          type: 'iceCandidate2',
          candidate: event.candidate
        }));
      }
    }

    const video = document.createElement('video');
    document.body.appendChild(video);
    pc.ontrack = (event) => {
      video.srcObject = new MediaStream([event.track]);
      video.play();
    }
  }

  async function initiateConnection() {
    const pc = new RTCPeerConnection();
    console.log("in");
    if (!socket) return;
    
    
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'createAnswer') {
        await pc.setRemoteDescription(message.sdp);
        console.log(message);
      } else if (message.type === 'iceCandidate') {
        pc.addIceCandidate(message.candidate);
        console.log(message);
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
    
    pc.onnegotiationneeded = async () => {
      console.log("dinn");
      
      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);
      

      socket.send(JSON.stringify({
        type: 'createOffer',
        sdp: pc.localDescription
      }));
    }

    await getCamera(pc);
  }

  async function getCamera(pc: RTCPeerConnection) {
    
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream);
    }

    const video = document.createElement('video');
    document.body.appendChild(video);
    video.srcObject = new MediaStream(stream);
    video.play();
    
  }

  return (
    <div>
      Sender

      <button onClick={initiateConnection}> Send data </button>
      
      
    </div>
  )
}
