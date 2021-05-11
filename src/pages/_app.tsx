//O app é basicamente um arquivo global, ele sempre fica por volta de todas as pags do app
//Sempre que uma pag é chamada o app tbm é chamado
import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';

import styles from '../style/app.module.scss';
import '../style/global.scss';

function MyApp({ Component, pageProps }) {
  

  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp
