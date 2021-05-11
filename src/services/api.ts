//Aqui estamos utilizando o axios para criar um baseURL (URL base)
//assim para todas as requisições  (request) que formos fazer
//para nossa api, poderemos partir direto do parametro desejado
//visto que o axios vai utilizar a baseURL que definimos
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333/' 
})

