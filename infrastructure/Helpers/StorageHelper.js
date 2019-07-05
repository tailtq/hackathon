import AWS from 'aws-sdk';
import fs from 'fs';
import url from 'url';

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});
const mainParams = {
  Bucket: process.env.AWS_BUCKET,
};
const s3 = new AWS.S3();

export function upload(path, image, accessType) {
  const body = fs.createReadStream(image.path);
  const params = Object.assign({}, mainParams, {
    Body: body,
    Key: path,
    ACL: accessType,
    ContentType: 'binary',
  });

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data.Location);
    });
  });
}

export function destroy(path) {
  const objects = [];
  if (typeof path === 'string') {
    let { pathname } = url.parse(path);
    pathname = pathname.substr(1);
    objects.push({
      Key: pathname,
    });
  } else {
    path.forEach((element) => {
      let { pathname } = url.parse(element);
      pathname = pathname.substr(1);
      objects.push({
        Key: pathname,
      });
    });
  }
  const params = Object.assign({}, mainParams, {
    Delete: { Objects: objects },
  });
  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
