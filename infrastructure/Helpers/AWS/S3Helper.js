require('dotenv/config');
const AWS = require('aws-sdk');
const url = require('url');

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});
const s3 = new AWS.S3();
const mainParams = {
  Bucket: process.env.AWS_BUCKET,
};

export function upload(path, body) {
  const params = Object.assign({}, mainParams, {
    Body: body,
    Key: path,
    ACL: 'public-read',
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
    const { pathname } = url.parse(path);
    objects.push({
      Key: pathname.substr(1),
    });
  } else {
    path.forEach((element) => {
      this.destroy(element);
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
