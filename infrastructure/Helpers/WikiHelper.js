import axios from 'axios'

const baseUrl = 'https://vi.wikipedia.org/w/api.php?format=json&action=opensearch&limit=10&search='

export default async function search(s) {
  const searchUrl = baseUrl + encodeURI(s)
  const result = await axios.get(searchUrl);
  const title = result.data[1][0]
  const content = result.data[2][0]
  const refLink = result.data[3][0]
  
  if(content == '') {
    return null
  }
  return {
    title,content, refLink
  }
}

