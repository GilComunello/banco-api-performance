import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterToken } from '../helpers/autenticacao.js';
import { pegarBaseUrl } from '../utils/variaveis.js';

export const options = {
  iterations: 1,
};

export default function () {

  const token = obterToken();

  const url = pegarBaseUrl() + '/transferencias';

  const payload = JSON.stringify({
    contaOrigem: 1,
    contaDestino: 2,
    valor: 100,
    token: " ",
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  };

  let res = http.post(url, payload, params);
  check(res, { "status is 201": (res) => res.status === 201});
  sleep(1);
}
