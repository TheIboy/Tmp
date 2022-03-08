/**
 * 将图片链接转换成Base64
 * @param imgSrc 图片链接
 * @returns {*} 转换后的Base64
 */
export const getBase64Image = (imgSrc) => {
  function getBase64(img) {

    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  }

  return new Promise((resolve) => {
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imgSrc;

    image.onload = () => {

      let imageBase64Data = getBase64(image);

      resolve(imageBase64Data);
    }
  });

};
