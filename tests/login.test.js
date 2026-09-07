import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
    iterations: 30,
    thresholds: {
        'http_req_duration': ['p(90)<70', 'max<100'],
        'http_req_failed': ['rate<0.01'],
    },
};

export default function () {
    //test login
    const url = 'http://localhost:3000/login';
    const payload = JSON.stringify({
        username: 'julio.lima',
        senha: '123456',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {
        'Validar que o status é 200': (r) => r.status === 200,
        'Validar que o token é uma string': (r) => typeof(r.json().token) == 'string',
    });
    sleep(1);
}