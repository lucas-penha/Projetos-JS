const axios = require('axios');

// Token da API Climatempo
const TOKEN = '6745c8346df7f3e6e2182e2091a0c0e6';

// IDs das cidades para registrar ao token (São Paulo, por exemplo)
const CIDADES = [3477]; 

// registrar cidades ao token
async function registrarCidades(token, cidades) {
    const url = `http://apiadvisor.climatempo.com.br/api-manager/user-token/${token}/locales`;
    try {
        // Construir o payload no formato correto
        const data = cidades.reduce((acc, cidade) => {
            acc.push(`localeId[]=${cidade}`);
            return acc;
        }, []).join('&');

        const response = await axios.put(
            url,
            data,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        console.log('Cidades registradas com sucesso:', response.data);
    } catch (error) {
        console.error(
            'Erro ao registrar cidades:',
            error.response ? error.response.data : error.message
        );
    }
}
// consultar as cidades registradas no token
async function consultarCidades(token) {
    const url = `http://apiadvisor.climatempo.com.br/api-manager/user-token/${token}/locales`;
    try {
        const response = await axios.get(url);
        console.log('Cidades vinculadas ao token:', response.data.locales);
    } catch (error) {
        console.error(
            'Erro ao consultar cidades:',
            error.response ? error.response.data : error.message
        );
    }
}

// obter a previsão do tempo para 15 dias
async function obterPrevisao15Dias(token, cidadeId) {
    const url = `https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${cidadeId}/days/15`;
    try {
        const response = await axios.get(url, {
            params: { token },
        });

        const previsao = response.data;
        console.log(`Cidade: ${previsao.name} - ${previsao.state}\n`);
        previsao.data.forEach((dia) => {
            console.log(`Data: ${dia.date}`);
            console.log(`Temp. mínima: ${dia.temperature.min} °C`);
            console.log(`Temp. máxima: ${dia.temperature.max} °C`);
            console.log(`Probab. de precipitação: ${dia.rain.probability} %`);
            console.log(`Precipitação: ${dia.rain.precipitation} mm`);
            console.log(`Frase: ${dia.text_icon.text.phrase.reduced}\n`);
        });
    } catch (error) {
        console.error(
            'Erro ao obter previsão:',
            error.response ? error.response.data : error.message
        );
    }
}


(async function () {
    console.log('Registrando cidades...');
    await registrarCidades(TOKEN, CIDADES);

    console.log('\nConsultando cidades registradas...');
    await consultarCidades(TOKEN);

    console.log('\nObtendo previsão para São Paulo...');
    await obterPrevisao15Dias(TOKEN, 3477); 
})();
