import axios, { AxiosResponse, AxiosError } from "axios";

type method = 'POST' | 'GET' | 'DELETE' | 'PATCH';

async function fetchAPI(method: method, endpoint: string, data?: any, headers?: any): Promise<any> {
  try {
    const response: AxiosResponse = await axios({
      method: method,
      headers: {
        // 'Content-Type': 'application/json',
        ...headers
      },
      url: `${process.env.BASE_URL}${endpoint}`,
      data: data
    });

    return response.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
}

export default fetchAPI;
