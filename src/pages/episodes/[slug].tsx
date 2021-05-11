//Roteamento no next
/**
 * 
 /** O Next faz automaticamente um roteamento dos arquivos que temos na pasta pages.
 * No Next isso se chama File System Rooting, onde basicamente os arquivos dentro da pasta pages, 
 * são os nomes que formam as rotas da aplicação.
 * Em componentes que gostaríamos que cada um possua sua rota, como por exemplo os episódios,
 * não poderíamos simplesmente criar um arquivo chamado episódio.tsx, pois todos os episódios teriam a mesma
 * rota e isso não é amigável para ao url link.
 * O slug tem o intuito de concatenar a rota de uma pasta a um nome que gostaríamos, por exemplo, 
 * "episodio/o-nome-do-episodio".
 * (o nome do arquivo não precisa ser necessáriamente 'slug', basta ele estar dentro de colchetes)
 * 
 * Abaixo é importado o componente useRouter, onde podemos definir a nomenclatura para esse slug.
 * 
  */
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from "next/link";
import { api } from "../../services/api";

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { PlayerContext } from '../../contexts/PlayerContext';

import styles from "./episode.module.scss";
import { useContext } from "react";

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string;
  durationAsString: string;
  duration: number;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
}


export default function Episode( {episode}: EpisodeProps ) {
  const router = useRouter();
  const { play } = useContext(PlayerContext)

  /**Por segurança o React nunca converte um texto HTML em um texto normal, pois
   *pode-se inserir dentro desse HTML, por exemplo, um script.
   *para força que um texto seja setado automaticamente em HTML deve ser passado
   *e dentro da tag deve ser passada a propriedade dangerouslySetInnerHTML (Perigosamente setado em HTML),
   *o qual deve receber um objeto. Exemplo <div> da description (descrição)
  */
  return (
    <div className={styles.episode}>
      
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image 
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button 
          type="button"
          onClick={()=>play(episode)}
        >
          <img src="/play.svg" alt="Tocar Episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString }</span>
      </header>

      <div 
        className={styles.description} 
        dangerouslySetInnerHTML={{__html: episode.description}}
      />

    </div>
  );
};


/** Explicando o getStatic paths
 * É um método obrigatório em toda a rota que utiliza geração estática (getStaticProps) e
 * que tem parâmetros dinâmicos (Que tem colchetes no nome do arquivo,  slug por exemplo é uma opção dinâmica).
 * Ele é obrigatório, pois página dinâmica é uma página sujeita a alteração, e para que seja
 * possível gerar uma página estática dinâmica o next necessita saber quais dados são necessários para
 * sua construção.
 * Então ao gerar a build (versão de produção), ele já saberá quais são os dados que serão gerados
 * previamente para a página estática dinâmica.
 * 
 * O fallback, caso sete como como false, ao tentar acessar um página que não foi gerada estaticamente,
 * é retornado um 404 (página não encontrada), ou seja, mantendo a integridade e a principal função de uma pág 
 * estática
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes',{
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
    //Parâmetros para a geração estática do getStaticPaths 
    const paths = data.map(episode => {
      return {
        params: {
          slug: episode.id
        }
      }
    });

    return {
      paths: [],
      //O fallbakc 'blocking', vem com o intuito de que o servidor continue processando as págs estaticamente.
      //Então no paths será passado os mais acessados e posteriormente incrementando ao StaticPaths
      //conforme os acesso as outras páginas não geradas anteriormente
      fallback: 'blocking'
    }
};

/** Explicando o slug (Parâmetro dinâmico)
 * O slug é um reactrook e só pode ser usado dentro de componentes, por isso aqui iremos obter o slug
 * através dos parâmetros do SSG, onde recebemos o contexto, e dentro do contexto teremos os params (parâmetros)
 * que é de onde queremos buscar os dados. 
 */
export const getStaticProps: GetStaticProps = async (ctx) =>{
  //a desestruturação aqui é exatamente o mesmo nome do arquivo, no caso slug
        /** nome do arquivo */
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)
  
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    duration: Number(data.file.duration),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
}