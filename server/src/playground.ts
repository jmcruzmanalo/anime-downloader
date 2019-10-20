import { si } from 'nyaapi';

(async () => {
  const res = await si.search('horriblesubs shokugeki no souma: shin no sara');
  res // ?
})();

// const response = si.search('horriblesubs kimetsu no yaiba 1080p');
