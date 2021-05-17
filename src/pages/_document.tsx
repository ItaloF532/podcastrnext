/**
* O arquivo document também fica por volta de toda a aplicação, porém ele é chamado uma unica vez
* não forçando a atualização da página a todo momento. 
* E também é nele que configuramos o formato do documento/html que fica por volta da aplicação.
* Isso por que no Next.js não há um  index.html para a manipulação, então para customizar o html é necessário o _document
*/

import Document, { Html, Head, Main, NextScript } from 'next/document';

//É necessário exportar o _document como classe! O next exige isso.
export default class MyDocument extends Document {
  //<Main /> É onde fica a aplicação
  //<NextScrip /> É onde fica os scripts que precisamos injetar na aplicação
  //No <Head> podemos colocar todas as configurações que queremos, como por exemplo as fontes
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/x-icon"/>
        </Head>
            <body>
              <Main />
              <NextScript />
            </body>
      </Html>
          );
  }
}