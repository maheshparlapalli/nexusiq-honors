import React, { useState } from 'react';
import axios from 'axios';
export default function MyCertificates(){
  const [email, setEmail] = useState('');
  const [list, setList] = useState<any[]>([]);
  async function fetch(){
    const res = await axios.get(`/api/v1/honors/me?email=${encodeURIComponent(email)}`);
    setList(res.data.data || []);
  }
  return (
    <div>
      <h2>My Certificates (dev-mode)</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={fetch}>Fetch</button>
      <ul>
        {list.map(h=> <li key={h._id}>{h.template_id} - {h.recipient?.name}</li>)}
      </ul>
    </div>
  );
}