
import JsSIP from 'jssip'


export default class SipConfig  {
    static userName: string;

    private static sipInstance:JsSIP.UA | null

    private static AudioInstanceCallBack :(stream:any) => void 

    private static IncomingCall_CallBack :(data:any) => void 

    socket:JsSIP.WebSocketInterface =  new JsSIP.WebSocketInterface('wss://express-app-tjes.onrender.com')

    private static  sipConfigInstance:SipConfig | null = null


    private constructor (userName:any) {

      console.log('init.....')
      console.log(userName)
    SipConfig.userName = userName
   
    
     


     const configuration = {
    sockets: [this.socket],
      transportOptions: {
    wsServers: ['wss://express-app-tjes.onrender.com'], // Crucial: NO PORT 80 HERE
    traceSip: true
  },
    connectionRecoveryMaxInterval: 30,
  // Tells the SIP stack to handle the Render proxy rewriting
  hackIpInContact: true, 
  connectionRecoveryMinInterval: 2,
    uri:userName,
    password: 'cymru',
     pcConfig: {
    iceServers: [
     [{"url": "stun:global.stun.twilio.com:3478", "urls": 
      "stun:global.stun.twilio.com:3478"},
       {"credential": "guvH2rLja0X2KM05eShrzsMJC66HOU4OUXsyzUvtJG0=", "url": "turn:global.turn.twilio.com:3478?transport=udp", "urls": "turn:global.turn.twilio.com:3478?transport=udp", "username": "a520d10cf0c5236057089afb8d69f7994d05097d4f88ffbf46ccf35233fc9953"},
        {"credential": "guvH2rLja0X2KM05eShrzsMJC66HOU4OUXsyzUvtJG0=", "url": "turn:global.turn.twilio.com:3478?transport=tcp", "urls": "turn:global.turn.twilio.com:3478?transport=tcp", "username": "a520d10cf0c5236057089afb8d69f7994d05097d4f88ffbf46ccf35233fc9953"}, {"credential": "guvH2rLja0X2KM05eShrzsMJC66HOU4OUXsyzUvtJG0=", "url": "turn:global.turn.twilio.com:443?transport=tcp", "urls": "turn:global.turn.twilio.com:443?transport=tcp", "username": "a520d10cf0c5236057089afb8d69f7994d05097d4f88ffbf46ccf35233fc9953"}]
    ]
  },
   session_timers:false

  };

    const ua = new JsSIP.UA(configuration)
    ua.start()
    
    SipConfig.sipInstance = ua
    SipConfig.sipInstance.on('registered',(e)=>{
      console.log('registered....',e.response)
      
    })



      SipConfig.sipInstance?.on('newRTCSession',(data:any)=>{
 

   // 2. Attach listener for the event (just in case)
  /*data.sesion.on('peerconnection', (rtcEvent: any) => {
 console.log('PeerConnection active:', rtcEvent);
  });*/

 
     

      if(data.originator === "remote"){
         console.log("Incoming call from:", data.session.remote_identity.uri.toString());
         SipConfig.IncomingCall_CallBack({caller:data.session.remote_identity.uri.toString(),session:data.session})
        // alert("Incoming call from:".concat( data.session.remote_identity.uri.toString()))
  

      }

     

     // console.log('incomming call from....',data.originator)
  
    })

  
    

   /*if(this.sipInstance){

       this.sipInstance?.start()

      
     
 socket.onconnect = ()=>{

  console.log('connected')
 }


   this.sipInstance.on('registered',(event:RegisteredEvent)=>{
    console.log('successfully registered')
     console.log(event)
   })

   }*/



    }


    
    static getSipConfigInstance = (userName:string) =>{
    if(this.sipConfigInstance){
      return this.sipConfigInstance
    }
    this.sipConfigInstance = new SipConfig(userName)
    return this.sipConfigInstance
    }

   

    public   placeCall (whoToCall:string){

      if(!SipConfig.sipInstance){
        throw ('Cannot place call invalid detail provided')
      }

      if(!whoToCall){
           throw ('whoToCall can not be null.')
      }

     try {
       console.log('fired... calling',whoToCall)
            
            SipConfig.sipInstance?.call(whoToCall,{
              eventHandlers:{
                peerconnection:(e)=>{
                  console.log("remote peer conections....",e.peerconnection)

                  e.peerconnection.addEventListener('track',e=>{
                   // console.log('track....',e.streams[0])
                    if(SipConfig.AudioInstanceCallBack ){
                          SipConfig.AudioInstanceCallBack(e.streams[0])
                    }
                   
                    
                  })
                }
              }
            })


     } catch (error) {
       console.log('calling error....',(error as Error).message)
     }
    }



    public static onAudioStream = (c:(stream:any)=>void) =>{
        SipConfig.AudioInstanceCallBack = c
    }


     public static onIncomingCall = (c:(session:any)=>void) =>{
        SipConfig.IncomingCall_CallBack = c
    }

     public closeConnection (){
      console.log('connection stopped...')
      SipConfig.sipInstance?.stop()
     }

    public static destroyInstance (userName:string){
       if(userName !== SipConfig.userName){
       console.log('instance destroyed.....') 
     this.sipConfigInstance = null
       }
    
    }

  public static isSipConfigInstance (){
    return this.sipConfigInstance ? true:false
  }
}