// @src/hooks/useVideoPlayer.js

import { useState, useEffect } from "react";
import { useNativeBalance, useWeb3Transfer, useMoralis, useChain } from "react-moralis";

const useVideoPlayer = (videoElement) => {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
  });

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  useEffect(() => {
    playerState.isPlaying
      ? videoElement.current.play()
      : videoElement.current.pause();
  }, [playerState.isPlaying, videoElement]);

  const handleOnEnded = () => {
    if (videoElement.current.ended) {
      togglePlay()
    }
  }

  const handleOnTimeUpdate = () => {
    const progress = (videoElement.current.currentTime / videoElement.current.duration) * 100;
    setPlayerState({
      ...playerState,
      progress,
    });
  };

  const handleVideoProgress = (event) => {
    const manualChange = Number(event.target.value);
    videoElement.current.currentTime = (videoElement.current.duration / 100) * manualChange;
    setPlayerState({
      ...playerState,
      progress: manualChange,
    });
  };

  var [watchedTime, setWatchedTime] = useState(0)

  useEffect(() => {
    if (playerState.isPlaying) {
      const interval = setInterval(() => {
        setWatchedTime(watchedTime => watchedTime + 1)
      }, 1000);
      return () => clearInterval(interval)
    }
    return undefined 
  }, [playerState.isPlaying, watchedTime])

  const handleVideoSpeed = (event) => {
    const speed = Number(event.target.value);
    videoElement.current.playbackRate = speed;
    setPlayerState({
      ...playerState,
      speed,
    });
  };

  const toggleMute = () => {
    setPlayerState({
      ...playerState,
      isMuted: !playerState.isMuted,
    });
  };

  useEffect(() => {
    playerState.isMuted
      ? (videoElement.current.muted = true)
      : (videoElement.current.muted = false);
  }, [playerState.isMuted, videoElement]);

  const toggleFullscreen = () => {
    if (videoElement.current) {
            videoElement.current.requestFullscreen();
    }
   }

  const video = videoElement.current
  const videolength = video?.duration % 60


   const setPrice = 0.0001
   const minBalanceAmount = videolength * setPrice
   const reviever = "0x0BC58805c5e5B1b020AfE6013Eeb6BcDa74DF7f0"
  
   var setPricePerSecond = watchedTime * setPrice

  const { Moralis } = useMoralis();
  const { switchNetwork, chainId, chain, account } = useChain();
  const { data: balance } = useNativeBalance({ chain : "ropsten" });
  const {fetch, error, isFetching} = useWeb3Transfer({
    amount: Moralis.Units.ETH(setPricePerSecond.toFixed(4)),
    receiver: reviever,
    type: "native",
  });

  const NativeBalance = () => {
    const getBalanceString = balance.formatted.split(' ')[0]
    const getBalance = Number(getBalanceString)
    console.log(getBalance)
    if (getBalance > minBalanceAmount) {
      return true
    }
    return false
  }

   async function TransferEth() {
    await switchNetwork("0x5")
    const timer = setTimeout(() => {
      fetch()
      console.log("watched total of " + watchedTime + " seconds")
    }, 1000);
    return () => clearTimeout(timer)
  }

  return {
    playerState,
    togglePlay,
    handleOnEnded,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    toggleFullscreen,
    NativeBalance,
    TransferEth,
    minBalanceAmount,
    isFetching,
  };
};

export default useVideoPlayer;
