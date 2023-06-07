import axios from 'axios';

const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-Key': 'hfFDDgyJiGcA93sEfRWQF61kqPD66rc7etsRDlEjjOZxQ3LVNZKMYRyB2Na3vx6f'}};

export async function getTokenPrice(address:string) {
    const apiUrl = `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=polygon`;
    try {
      const response = await axios.get(apiUrl,options);
      const price = response.data.usdPrice;
      return price;
    } catch (error) {
      return null;
    }
  }