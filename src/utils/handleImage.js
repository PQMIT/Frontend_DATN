import { isImageUrlCheck } from '../utils/string';

const handleImageQuestion = (textString) => {
  // const textString = questionSelected.data.description;
  const imageUrlRegex2 = /\{(.*?)\}/g;
  const replacedString = textString.replace(
    imageUrlRegex2,
    (match, imageUrl) => {
      if (isImageUrlCheck(imageUrl)) {
        return `<img src="${imageUrl}" alt="Hình ảnh test" style="width: auto; height: 350px;"  />`;
      } else {
        return imageUrl;
      }
    },
  );
  return replacedString;
};

export default handleImageQuestion;
