import AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const SIGNED_URL_EXPIRY = 600;

export async function uploadBuffer(buffer, key, contentType){
  const params = { 
    Bucket: process.env.AWS_S3_BUCKET, 
    Key: key, 
    Body: buffer, 
    ContentType: contentType
  };
  await s3.putObject(params).promise();
  return key;
}

export async function deleteObject(key){
  if (!key) return false;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  };
  await s3.deleteObject(params).promise();
  return true;
}

export function getSignedUrl(key, expiresIn = SIGNED_URL_EXPIRY){
  if (!key) return null;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: expiresIn
  };
  return s3.getSignedUrl('getObject', params);
}

export function getPublicUrl(key){ 
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`; 
}
