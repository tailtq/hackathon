import axios from 'axios'

const baseUrl = 'https://vi.wikipedia.org/w/api.php?format=json&action=opensearch&limit=1&search=';

export default async function search(s) {
  const searchUrl = `${baseUrl}${encodeURI(s)}`;
  const res = await axios.get(searchUrl);
  const { data } = res;
  const title = data[1][0];
  const content = data[2][0];
  const refLink = data[3][0];

  return content ? { title, content, refLink } : null;
}
