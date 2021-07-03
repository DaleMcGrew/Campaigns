/**
 * @param originalString
 * @param numberOfWordsToReturn
 * @param includeEllipses
 * @returns {string}
 */
export default function returnFirstXWords (originalString, numberOfWordsToReturn, includeEllipses = false) {
  if (!originalString) return '';

  let needForEllipses = false;
  const wordsArray = originalString.split(' ');
  let xWords = '';
  for (let i = 0; i < wordsArray.length; i++) {
    if (i >= numberOfWordsToReturn) {
      break;
    }
    xWords += `${wordsArray[i]} `;
    needForEllipses = true;
  }
  // Finally remove leading or trailing spaces
  xWords = xWords.trim();
  if (needForEllipses && includeEllipses) {
    xWords += '...';
  }
  return xWords;
}
