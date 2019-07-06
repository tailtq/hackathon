import axios from 'axios'

const APP_ID = 'HAXXWJ-TTLV7WAGP5';

export default async function solve(sentence) {
  try {
    const result = await axios.get(`http://api.wolframalpha.com/v2/result?&appid=${APP_ID}&input=${sentence}`);

    return (result.status === 200) ? result.data : false;
  } catch (error) {
    return false;
  }
}
