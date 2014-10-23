gapi.client.setApiKey('AIzaSyAl9U3IOV4IYV_ye1DUlfczyjF5zA-7N2g');
gapi.client.load('translate', 'v2');

function handleTranslation(response) {
  console.log(getTranslatedText(response));
}

function arrayTranslate(languages, EnglishText) {
  // Duplicate the array and do a random shuffle.
  languages = shuffle(languages.concat(languages));

  var partial = beginTranslate('en', languages[0], EnglishText);
  for (var i = 1; i < languages.length; ++i) {
    if (languages[i-1] == languages[i]) continue;
    partial = partial.then(translate(languages[i-1], languages[i]));
  }
  partial = partial.then(translate(languages[languages.length - 1], 'en'));
  return partial.then(handleTranslation);
}

function beginTranslate(src, target, txt) {
  return gapi.client.language.translations.list({
    'source': src,
    'target': target,
    'q': txt
  });
}

function getTranslatedText(response) {
  return response.result.data.translations[0].translatedText;
}

function translate(src, target) {
  return function(response) {
    handleTranslation(response);
    return beginTranslate(src, target, getTranslatedText(response));
  };
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
