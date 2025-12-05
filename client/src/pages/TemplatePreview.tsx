import React from 'react';
import axios from 'axios';
export default function TemplatePreview({ params }: any){
  const { id } = params;
  const [tpl, setTpl] = React.useState<any>(null);
  React.useEffect(()=> {
    axios.get(`/api/v1/templates/${id}`).then(r=> setTpl(r.data.data)).catch(()=> setTpl(null));
  },[id]);
  if(!tpl) return <div>Loading...</div>;
  return (
    <div>
      <h2>Template Preview: {tpl.name}</h2>
      <p>Type: {tpl.type} | Version: {tpl.version}</p>
      <div style={{border:'1px solid #ddd', padding:12}}>
        <img src={tpl.layout?.background_url} alt="bg" style={{maxWidth:400}} />
        <pre>{JSON.stringify(tpl.fields,null,2)}</pre>
      </div>
    </div>
  );
}