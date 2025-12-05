import React from 'react';
import { Router, Route, Link } from 'wouter';
import Landing from './pages/Landing';
import PublicCertificate from './pages/PublicCertificate';
import MyCertificates from './pages/MyCertificates';
import TemplatePreview from './pages/TemplatePreview';
import AllCertificates from './pages/AllCertificates';
import AllTemplates from './pages/AllTemplates';

export default function App(){
  return (
    <Router>
      <nav style={{padding:12, borderBottom:'1px solid #eee', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap'}}>
        <Link href="/">Home</Link>
        <span style={{color:'#ccc'}}>|</span>
        <Link href="/certificates">All Certificates</Link>
        <span style={{color:'#ccc'}}>|</span>
        <Link href="/templates">All Templates</Link>
        <span style={{color:'#ccc'}}>|</span>
        <Link href="/my-certificates">My Certificates</Link>
      </nav>
      <div style={{padding:20}}>
        <Route path="/" component={Landing} />
        <Route path="/certificates" component={AllCertificates} />
        <Route path="/templates" component={AllTemplates} />
        <Route path="/c/:slug">
          {params => <PublicCertificate params={params} />}
        </Route>
        <Route path="/my-certificates" component={MyCertificates} />
        <Route path="/preview/:id">
          {params => <TemplatePreview params={params} />}
        </Route>
      </div>
    </Router>
  );
}