import { existsSync } from "fs";
import { simpleExtractor } from "../utilities/keywordExtractor.js";

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const emptyResponse = [ 
    'Idk',
    'You tell me',
    'If you tell me, we will both know',
    'It\'s a secret',
    'Some things you should figure by your self',
    'No you',
    'I don\'n know'
]
export function getRandomEmptyResponse() {
  return emptyResponse[getRandomNumber(0, emptyResponse.length - 1)]
}

export function startsWithCapital(word){
  return word.charAt(0) === word.charAt(0).toUpperCase()
}

export function getOS() {
  const platform = process.platform;
  console.log(platform);
  let os;
  if (platform.includes('darwin')) {
    os = 'Mac OS';
  } else if (platform.includes('win32')) {
    os = 'Windows';
  } else if (platform.includes('linux')) {
    os = 'Linux';
  }

  return os;
}

export function detectOsOption() {
  const os = getOS();
  const options = {executablePath: null};
  let chromePath = '';
  switch (os) {
      case 'Mac OS':
          chromePath = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome';
          break;
      case 'Windows':
          chromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
          break;
      case 'Linux':
          chromePath = '/usr/bin/google-chrome';
          break;
      default:
          break;
  }

  if (chromePath) {
      if (existsSync(chromePath)) {
          options.executablePath = chromePath;
      }
      else {
          console.warn("Warning! Please install Google Chrome to make bot workiing correctly in headless mode.\n");
      }
  }
  return options;
}

export function convertLocalToUtcTimezone(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

export function getStartingMessageKeywords() {
  const res = [];
  const data = customConfig.instance.get('starting_messages').split('|');
  for (let i = 0; i < data.length; i++) {
      const kw = simpleExtractor(data[i]);
      for (let j = 0; j < kw.length; j++) {
          res.push(kw[j]);
      }
  }
  return res;
}

export function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}