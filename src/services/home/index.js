import axios from 'axios';
import Config from 'react-native-config';

export const searchImages = async (search = 'dogs', page = 1, limit = 12) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${Config.HOST}?method=flickr.photos.search&api_key=${Config.FLICKR_API_KEY}&format=json&nojsoncallback=1&text=${search}&page=${page}s&per_page=${limit}`,
        {},
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
