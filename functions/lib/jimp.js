const Jimp = require('jimp');
const Promise = require('bluebird');

module.exports = {
	avaProcess: (file,w,h,q, crop) => {
    return new Promise((resolve, reject) => {
      Jimp.read(file).then( image => {
        let size = Math.min(image.bitmap.width, image.bitmap.height);
        let x = (image.bitmap.width - size) / 2;
        let y = (image.bitmap.height - size) / 2;

        if (crop) {
          image.clone().exifRotate().crop(x, y, size, size).resize(w,h).quality(q).getBuffer(image.getMIME(), (err, data) => (err ? reject(err) : resolve(data)));
        } else {
          image.clone().exifRotate().resize(w,h).quality(q).getBuffer(image.getMIME(), (err, data) => (err ? reject(err) : resolve(data)));
        }
      });
    });
  }
}
