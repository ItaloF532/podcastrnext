import Image from 'next/image';
import { useRef, useEffect } from 'react';
//Biblioteca para slider de audios/videos
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
//No next o css pode ser importado onde vc quiser.
import 'rc-slider/assets/index.css';

export default function Player() {
  //No next a ref é uma referência para manipulação de elementos, ele é como uma chave de acesso.
  //É legal sempre iniciar a referência como null
  /** Tipagem de elementos no TypeScrip
   * Por padrão no TypeScrip, quando usado com HTML, todas tipagens dos elementos do HTML ficam disponíveis
   * de forma global. 
   */
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { 
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    setPlayingState,
    hasNext,
    hasPrevious
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current){
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    } else {  
      audioRef.current.pause();
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong> Tocando agora </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong> Selecione um podcast para ouvir </strong>
        </div>
      )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span> 00:00 </span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderBlockColor: '#04d361', borderWidth: 4 }}
              />
            ) :
            (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span> 00:00 </span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}
        
        <div className={styles.buttons}>
          <button type='button' disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button 
            type='button' 
            className='styles.playButton' 
            disabled={!episode}
            onClick={togglePlay}
          >
            { isPlaying 
              ? <img src="/pause.svg" alt="Pausar"/>
              : <img src="/play.svg" alt="Tocar" />
            } 
          </button>
          <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button type='button' disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>

      </footer>
    </div>
  );
}