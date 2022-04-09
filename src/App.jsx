// @src/App.jsx

import React, { useRef } from "react";
import "./App.css";
import "boxicons";
import { useMoralis } from "react-moralis";
import { ConnectButton, BannerStrip, Button } from "web3uikit"


import useVideoPlayer from "./hooks/useVideoPlayer";

const App = () => {

  const video = "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
  const videoElement = useRef(null);
  const { isAuthenticated, isAuthenticating, logout } = useMoralis();

  const {
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
  } = useVideoPlayer(videoElement);
  return (
    
    <div className="container">
      {!isAuthenticated ? 
        (<div className="connect-button">
          <ConnectButton moralisAuth chainId={3}/>
        </div>
        ) : (
        <div className="logout-button">
          <Button
            id="test-button-primary"
            onClick={logout}
            text="Log Out"
            theme="secondary"
            type="reset"
            disabled={isAuthenticating}
          />
        </div>
        )
        }
      <div className="video-wrapper">
        <video
          src={video}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
          onEnded={handleOnEnded}
          controlsList="nodownload"
          onContextMenu={(e)=> e.preventDefault()}
        />
        {NativeBalance && isAuthenticated ? (
          <div className="controls">
          <div className="actions">
            <button onClick={togglePlay}>
              {!playerState.isPlaying ? (
                <i className="bx bx-play">▶️</i>
              ) : (
                <i className="bx bx-pause">⏸</i>
              )}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={playerState.progress}
            onChange={(e) => handleVideoProgress(e)}
          />
          <select
            className="velocity"
            value={playerState.speed}
            onChange={(e) => handleVideoSpeed(e)}
          >
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
          <button className="mute-btn" onClick={toggleMute}>
            {!playerState.isMuted ? (
              <i className="bx bxs-volume-full">🔊</i>
            ) : (
              <i className="bx bxs-volume-mute">🔇</i>
            )}
          </button>
          <button className="full-screen" onClick={toggleFullscreen}>
              <i>📺</i>
          </button>
        </div>
        ) : (
          <div>
            <BannerStrip
              text={"You need at least " + minBalanceAmount.toFixed(4) + " ETH in your wallet to watch this video!"}
              type="error"
            />
          </div>
        )}
      </div>
      {!playerState.isPlaying && (
      <div className="end-video-button">
        <Button
          icon="eth"
          id="test-button-primary"
          onClick={TransferEth}
          text="End Video"
          theme="primary"
          type="button"
          isLoading={isFetching}
        />
      </div>
      )}
    </div>
  );
};

export default App;