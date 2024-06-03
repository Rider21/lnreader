import { defaultCover } from '@plugins/helpers/constants';
import { getMMKVObject } from '@utils/mmkv/mmkv';
import { fetchFile } from '@plugins/helpers/fetch';

export interface WSRV_SETTINGS {
  status: boolean;
  output: 'jpg' | 'png' | 'tiff' | 'webp';
  compressionLevel: number;
  quality: number;
  adaptiveFilter: boolean;
  progressive: boolean;
  lossless: boolean;
}
const defaultSettings: WSRV_SETTINGS = {
  status: false,
  output: 'jpg',
  compressionLevel: 6,
  quality: 80,
  adaptiveFilter: true,
  progressive: true,
  lossless: false,
};
const baseURL = 'https://wsrv.nl';

export const availableFormats: string[] = ['jpg', 'png', 'tiff', 'webp'];
export const settings = getMMKVObject<WSRV_SETTINGS>('WSRV') || defaultSettings;

export const resolveImage = (url: string) => {
  if (!url) {
    return defaultCover;
  }
  if (settings.status && url.startsWith('http')) {
    console.log(url);
    return gen(url) + '&default=1';
  }
  return url;
};

export const fetchImageWSRV = async (url: string) => {
  if (settings.status && url) {
    const imageURL = gen(url) + '&encoding=base64';
    const image = await fetch(imageURL).then(res => res.text());
    if (image.startsWith('data:image/')) {
      return image.slice(image.indexOf(',') + 1);
    } else {
      console.log(image); // error
    }
  }
  return fetchFile(url || defaultCover);
};

function gen(url) {
  let imageURL = baseURL + '?url=' + url + '&output=' + settings.output;

  if (settings.output === 'png') {
    imageURL +=
      '&l=' +
      settings.compressionLevel +
      (settings.adaptiveFilter ? '&af' : '') +
      (settings.progressive ? '&li' : '');
  } else if (settings.output === 'webp' && settings.lossless) {
    imageURL += '&ll';
  } else {
    imageURL += '&q=' + settings.quality;
  }

  if (settings.progressive && settings.output === 'jpg') {
    imageURL += '&il';
  }

  return imageURL;
}

/*
function isBlocked(url) {
  const aux = url.split('//')[1].split('/')[0];
  const suffix = aux.substring(aux.lastIndexOf('.') + 1);
  switch (suffix) {
    //these domains are banned in wsrv
    case 'buzz':
    case 'cc':
    case 'club':
    case 'date':
    case 'fun':
    case 'pw':
    case 'top':
    case 'xxx':
    case 'xyz':
      return true;
    default:
      return false;
  }
}
*/
