import axios from 'axios';

// fetcher(주소를 어떻게 처리할지, fetcher에서 1번ㅉ ㅐ인자의 주소를 어떻게 처리할지)
const fetcher = (url: string) => axios.get(url, {
  withCredentials: true, 
})
  .then(res => res.data);

export default fetcher;