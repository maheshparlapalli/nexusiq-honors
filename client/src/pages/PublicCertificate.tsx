import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function PublicCertificate({ params }: any){
  const { slug } = params;
  const [data, setData] = useState<any>(null);
  useEffect(()=> {
    async function load(){ 
      try {
        const res = await axios.get(`/api/v1/honors/public/${slug}`);
        setData(res.data.data);
      } catch(err:any){
        setData({ error: err.response?.data?.message || 'Not found' });
      }
    }
    load();
  },[slug]);
  if(!data) return <div>Loading...</div>;
  if(data.error) return <div>{data.error}</div>;
  return (
    <div>
      <h2>Certificate: {data.template_id}</h2>
      <p>Recipient: {data.recipient?.name} ({data.recipient?.email})</p>
      <p>Issued: {new Date(data.createdAt).toLocaleString()}</p>
      <div>
        {data.assets?.image_url ? <img src={data.assets.image_url} alt="certificate" style={{maxWidth:'100%'}} /> : <p>No image</p>}
      </div>
    </div>
  );
}