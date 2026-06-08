'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import JsSIP, { UA } from 'jssip'
import { useCallback, useEffect, useRef, useState } from "react";
import SipConfig from "@/helper/SIpConfig";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function Home() {

  const [userSipDetails, setUserSipDetails] = useState('')

  const [userToCallSipDetails, setUserUserToCallSipDetails] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [incomingCallDetails, setIncomingCallDetails] = useState()

  const dialogBtnRef = useRef<HTMLButtonElement>(null)



  const handleInit = useCallback(() => {
    if (SipConfig.isSipConfigInstance()) {

      SipConfig.destroyInstance(userSipDetails)

    }
    SipConfig.getSipConfigInstance(userSipDetails)

    SipConfig.onAudioStream((stream) => {
      console.log('Audio stream.....', stream)

      if (audioRef.current) {
        audioRef.current.srcObject = stream;
      }
      audioRef?.current?.play()
    })

    SipConfig.onIncomingCall((data) => {
      setIncomingCallDetails(data)
      dialogBtnRef.current?.click()
    })
  }, [userSipDetails])


  /*
    const socket = new JsSIP.WebSocketInterface('ws://127.0.0.1:80')
    /*
      var configuration = {
        sockets: [socket],
        uri: userSipDetails,
        password: 'cymru'
    
    
      };*/













  // Register callbacks to desired call events
  var eventHandlers = {
    'progress': function (e: any) {
      console.log('call is in progress');
    },
    'failed': function (e: any) {
      console.log('call failed with cause: ' + e.data.cause);
    },
    'ended': function (e: any) {
      console.log('call ended with cause: ' + e.data.cause);
    },
    'confirmed': function (e: any) {
      console.log('call confirmed');
    }
  };

  var options = {
    'eventHandlers': eventHandlers,
    'mediaConstraints': { 'audio': true, 'video': true }
  };


  //let sipInstance: SipConfig

  JsSIP.debug.enable('JsSIP:*');


  return (
    <div className="h-screen bg-black flex flex-col gap-10 p-5">

      <input onChange={e => {
        setUserSipDetails(e.target.value)
      }} placeholder="enter your name" className="bg-red-300 h-10" />


      <Button className="bg-amber-300" onClick={() => {

        if (userSipDetails) {
          handleInit()
          //let ua = new JsSIP.UA(configuration)
          /*  ua.start()
            ua.on('registered', (e) => {
              console.log('registered...', e.response)
            })*/

        }

      }} >
        initilalize
      </Button>


      <input placeholder="user to call" onChange={e => {
        setUserUserToCallSipDetails(e.target.value)
      }} className="bg-red-300 h-10" />

      <Button onClick={() => {
        console.log('button to call fire...', SipConfig.getSipConfigInstance(userSipDetails))
        if (userToCallSipDetails && SipConfig.isSipConfigInstance()) {
          console.log('called...', userToCallSipDetails)
          SipConfig.getSipConfigInstance(userSipDetails)?.placeCall(userToCallSipDetails)
        }

        /*
                ua!!.call('sip:bob@127.0.0.1:5060', {
                  eventHandlers: {
        
                    failed: (e: any) => {
                      console.log(e)
                    },
                    progress: (e: any) => {
                      console.log(e)
                    }
                  },
        
        
                });*/
        //console.log(socket.isConnected)
      }} variant={"outline"} className="bg-amber-400">
        call user
      </Button>

      <audio ref={audioRef} id="remoteAudio" autoPlay></audio>

      <Button className="bg-amber-400" onClick={async () => {
        const constraints = {
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true // Set to true to capture microphone alongside video
        };

        const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      }}>
        now
      </Button>

      <AlertDialog>
        {/* The hidden trigger you can programmatically click using your dialogBtnRef */}
        <AlertDialogTrigger asChild>
          <Button ref={dialogBtnRef} className="hidden">Open Inbound Call Prompt</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="sm:max-w-[425px] text-center border-emerald-500/20 bg-background">
          <AlertDialogHeader className="flex flex-col items-center justify-center space-y-4">
            {/* Visual pulse indicator for an active ring state */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 animate-pulse">
              <svg xmlns="http://w3.org" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>

            <AlertDialogTitle className="text-2xl font-bold tracking-tight">
              Incoming Call From {incomingCallDetails?.caller}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base text-muted-foreground">
              An inbound connection request is pending. Tap continue to authorize hardware media layers and connect.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
            {/* Reject Button */}
            <AlertDialogCancel
              id="sip-reject-btn"
              className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Decline
            </AlertDialogCancel>

            {/* Answer Button (The direct user gesture target) */}
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();

                try {

                  const constraints = {
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                    audio: true // Set to true to capture microphone alongside video
                  };

                  const localStream = await navigator.mediaDevices.getUserMedia(constraints);

                  incomingCallDetails?.session.answer({
                    mediaStream: localStream
                  });

                } catch (error) {

                  console.log(error)

                }



              }}
              id="sip-answer-btn"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Answer Call
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
