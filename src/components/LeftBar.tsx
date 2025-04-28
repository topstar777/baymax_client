import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import Chat from "./Chat";
import SystemSetting from "./SystemSetting";

interface Props {
  socket: Socket;
  voicesocket: Socket;
  username: string;
  room: string;
}

const LeftBar = ({ socket, voicesocket, username, room }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    voicesocket.on("offer", async (offer: RTCSessionDescriptionInit) => {
      console.log("Received offer");
      if (!peerConnection.current) createPeerConnection();

      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);
      voicesocket.emit("answer", answer);
    });

    voicesocket.on("answer", async (answer: RTCSessionDescriptionInit) => {
      console.log("Received answer");
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    voicesocket.on("ice-candidate", (candidate: RTCIceCandidateInit) => {
      console.log("Received ICE candidate");
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        voicesocket.emit("ice-candidate", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track");
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    };

    peerConnection.current = pc;
  };

  const startSharingAudio = async () => {
    try {
      // 1. Must request video + audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          // You can specify system audio options here (browser decides)
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100
        }
      });

      localStream.current = stream;

      // 2. Create Peer Connection
      if (!peerConnection.current) createPeerConnection();

      stream.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, stream);
      });

      // 3. Create Offer
      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      voicesocket.emit("offer", offer);
    } catch (err) {
      console.error("Error sharing audio:", err);
    }
  };

  const handleCopyRoomName = () => {
    navigator.clipboard.writeText(room);
    alert("Room name copied to clipboard!");
  };

  return (
    <div className="hidden md:flex md:flex-col w-full h-screen md:w-1/2 bg-white/10 backdrop-blur-md rounded-xl p-4">
      <div className="p-4">
        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
          Room Name
        </label>
        <div className="flex items-center">
          <input
            type="text"
            id="roomName"
            value={room}
            readOnly
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCopyRoomName}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Copy
          </button>
          <button 
            onClick={startSharingAudio}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Share
          </button>
        </div>
      </div>
      <SystemSetting systemSetting="I'm a senior software engineer" />
      <Chat socket={socket} username={username} room={room} />
    </div>
  );
};

export default LeftBar;