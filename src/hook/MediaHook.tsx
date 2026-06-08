import { useState } from "react"

const useMediaHook = () => {
    const [audioStreeam, setAudioStream] = useState()


    return { audioStreeam, setAudioStream }
}

export default useMediaHook