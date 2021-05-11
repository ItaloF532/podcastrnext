import { GetStaticProps } from 'next';
import { useContext, useState } from 'react';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

/** Explicando o Image do next
 *  Image é um componente do próprio next, obviamente importado do next.
 *  Ele pode ser usado no lugar das tags "img" do html.
 *  Por que usa-lo?
 *  Ele geralmente é usado em imagens mais pesadas, pois ele otimiza o carregamento da imagem
 *  podendo carrega-la já no tamanho desejado, evitando o trazer a imagem de um tamanho que não será usado/aproveitado
 *  No componente Image, deve ser passado sempre os parâmetros de altura (width) e largura (height), para que a 
 *  imagem seja carregada de acordo com esse parâmetro (geralmente 3x maior do que será usado).
 *  Por padrão o componente Image não funciona para qualquer endereço de imagem, então é necessário configurar
 *  os domínios em quais locais estão hospedadas suas imagens. Essa configuração ficara no arquivo "next.config.js"
 */
import Image from 'next/image';

/** Explicando o Link do Next
 * Ainda dentro do Next, para que não seja perdida sua flexibilidade e agilidade em carregar somente
 * o necessário para uma nova página, existe o componente Link, para que quando trocarmos de página não 
 * aconteça de tudo ser carregado novamente.
 * Esse link fica recebe a ancora de acesso para novas páginas.
 */
 import Link from "next/link";

import styles from './home.module.scss';
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';



//Tipagem para as propriedades do componente Home
//Tipagem do que é um episódio, ou seja, quais informações devem compo-lo
type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string;
  durationAsString: string;
  duration: number;
  url: string;
};

//Passando a tipagem do Episode para um array, ou seja um array de Episode
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};


//No react é usado apenas o map como estrutura de repetição.
//A key do  react é como se fosse um chave primaria para identificar os elementos
//após uma estrutura de repetição. 
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext)
  
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos Episódios</h2>

          <table>
            <thead>
                <tr>
                <th></th>
                <th>PodCast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map(episode=>{
                return(
                  
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>                    
                      <Image
                        width={192}
                        height={192}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit='cover'
                      />
                    </td> 
                    <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>  
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => play(episode)}>
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>

                )
              })}

            </tbody>
          </table>
      </section>
    </div>
  );
}


//Arrow function para exportação de uma pagina estática, que sera servida para todos que acessarem a pagina
//A atualização da pag varia de acordo com a propriedade revalidate
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    //Parâmetros de filtro utilizando axios
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }

  })

  //tentativa de tipagem fracassada
  // type Episode = {
  //   id: string;
  //   title: string;
  //   members: string;
  //   thumbnail: string;
  //   publishedAt: Date;
  //   durationAsString: string;
  //   duration: number;
  //   description: string;
  //   url: string;
  // };

  // type Episodes = {
  //   episodes: Episode[];
  // };

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      duration: Number(episode.file.duration),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }
}

/* Abaixo funções não tipadas
export async function getStaticProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return{
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}

Server Side Rendering (SSR), todo a vez que a pagina for acessada, será devolvida a pag atualizada.

 * export async function getStaticProps(){
 * const response = await fetch('http://localhost:3333/episodes')
 * const data = await response.json()
 *
 *  return{
 *    props: {
 *      episodes: data,
 *    }
 *  }
 * }
 *  */