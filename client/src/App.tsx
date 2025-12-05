import React from 'react';
import { Router, Route, Link } from 'wouter';
import Landing from './pages/Landing';
import PublicCertificate from './pages/PublicCertificate';
import MyCertificates from './pages/MyCertificates';
import TemplatePreview from './pages/TemplatePreview';

export default function App(){
  return (
    <Router>
      <nav style={{padding:12, borderBottom:'1px solid #eee'}}>
        <Link href="/">Home</Link> | <Link href="/c/TESTSLUG">Sample Cert</Link> | <Link href="/my-certificates">My Certificates</Link>
      </nav>
      <div style={{padding:20}}>
        <Route path="/" component={Landing} />
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