/** A ContextAPI, é uma API que permite o compartilhamento de informações entre os componentes do React
 * Por exemplo, neste projeto possuímos o componente player, para que o podcast possa ser tocado, 
 * utilizado play/pause, etc. E eu necessito que ao executar uma ação em um componente, e essa deve refletir
 * em um outros componentes (que esses outros componentes "ouçam a ação") e tenham, ou não, alguma reação.
 * Porém ele necessita receber de outros componentes o podcast que deve ser tocado, ou qualquer outra ação
 */

/** O que é necessário para que outros componentes acessem esse Contexto?
 * Para que os outros componentes possam acessar esse contexto (informação), é necessário que um componente
 * que vem de dentro contexto fique em volta dos componentes, no arquivo _app.tsx, que necessitam desse acesso.
 * No caso seria o PlayerContext.Provider que sempre irá precisar de um valor (value)
 */

/** Exemplo de uso do contexto em outro componente
 * exemplo do PlayerContext instanciado no arquivo em: src/components/Player/index.tsx
 * E sempre que que um dos componentes alterar a informação, os demais sofreram com está ação.
 */

import { createContext, useState, ReactNode, useContext, VoidFunctionComponent } from 'react';

//Tipagem do parametro do creatContext
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  //O currentEpisodeIndex aponta apenas para o índice do episódio da lista que está sendo tocado.
  currentEpisodeIndex: number; 
  //Para que outros componentes acessem funções do contexto (por exemplo uma que manipule os dados do contexto)
  //é necessário que o contexto receba essa função, veja em _app.tsx
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
}

//Tipagem forçada do parâmetro
export const PlayerContext = createContext({} as PlayerContextData);


type PlayerContextProviderProps = {
  children: ReactNode;
}

//O propriedade childre vem de props, e é ela que permite que seja passado um conteúdo ao componente
export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);
  
  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex>0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() *  episodeList.length);
      
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    } else {
      return;
    }
  }

  return (
    <PlayerContext.Provider 
      value={{ episodeList, 
      currentEpisodeIndex, 
      play, 
      playList,
      playNext,
      playPrevious,
      isPlaying,
      isLooping,
      isShuffling,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      hasPrevious,
      hasNext,
      clearPlayerState 
    }}
    >
      {children} 
    </PlayerContext.Provider>
  )
}

//Exporta o import do useContext e o PlayerContext
export const usePlayer = () => {
  return useContext(PlayerContext);
}