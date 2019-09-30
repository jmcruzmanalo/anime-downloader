const { si } = require('nyaapi');

(async () => {
  const res = await si.search('horriblesubs dungeon ni deai wo motomeru no wa machigatteiru darou ka ii');
  res // ?
})();

// const response = si.search('horriblesubs kimetsu no yaiba 1080p');
