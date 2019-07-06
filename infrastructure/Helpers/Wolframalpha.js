const translate = require('@k3rn31p4nic/google-translate-api')
import axios from 'axios'
const APP_ID = "HAXXWJ-TTLV7WAGP5"
export default async function solve(sentence) {
  try {
    const result = await axios.get('http://api.wolframalpha.com/v2/result?&appid='+APP_ID+'&input='+sentence)
    if(result.status != 200) {
      return false
    }
    return result.data
  } catch (error) {
    throw error
  }
  
}