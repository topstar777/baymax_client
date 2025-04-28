import { Resizable } from "re-resizable";
import { Box, Typography, Divider, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import OneToOneChat from "./OneToOneChat";
import { Socket } from "socket.io-client";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";

interface Props {
  socket: Socket;
  voiceSocket: Socket;
  username: string;
  room: string;
  onClose: () => void;
}

const Sidebar = ({ socket, voiceSocket, username, room, onClose }: Props) => {
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "#414141" : "#a3a3a3";
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    voiceSocket.on("offer", async (offer: RTCSessionDescriptionInit) => {
      console.log("Received offer");
      if (!peerConnection.current) createPeerConnection();

      await peerConnection.current!.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);
      voiceSocket.emit("answer", answer);
    });

    voiceSocket.on("answer", async (answer: RTCSessionDescriptionInit) => {
      console.log("Received answer");
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    voiceSocket.on("ice-candidate", (candidate: RTCIceCandidateInit) => {
      console.log("Received ICE candidate");
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        voiceSocket.emit("ice-candidate", event.candidate);
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
          sampleRate: 44100,
        },
      });

      localStream.current = stream;

      // 2. Create Peer Connection
      if (!peerConnection.current) createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
      });

      // 3. Create Offer
      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      voiceSocket.emit("offer", offer);
    } catch (err) {
      console.error("Error sharing audio:", err);
    }
  };

  return (
    <Resizable
      defaultSize={{ width: 700 }}
      enable={{ right: true }}
      style={{
        background: theme.palette.background.paper,
        borderRight: `1px solid ${borderColor}`,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton onClick={onClose}>
          <MenuIcon />
        </IconButton>
        <Button
          variant="contained"
          onClick={startSharingAudio}
          sx={{
            background: "linear-gradient(to right, #2563eb, #3b82f6)",
            color: "white",
            fontWeight: "bold",
            borderRadius: 1.5,
            py: 1.2,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              background: "linear-gradient(to right, #1e40af, #2563eb)",
            },
          }}
        >
          Share
        </Button>
      </Box>

      <Box p={2} flex={1} overflow="auto">
        <OneToOneChat socket={socket} username={username} room={room} />
      </Box>
    </Resizable>
  );
};

export default Sidebar;
