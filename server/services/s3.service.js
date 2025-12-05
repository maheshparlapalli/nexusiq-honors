import AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export async function uploadBuffer(buffer, key, contentType){
  const params = { 
    Bucket: process.env.AWS_S3_BUCKET, 
    Key: key, 
    Body: buffer, 
    ContentType: contentType
  };
  await s3.putObject(params).promise();
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function getPublicUrl(key){ 
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`; 
}
