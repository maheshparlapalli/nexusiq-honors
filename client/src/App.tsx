import React from 'react';
import { Router, Link } from 'wouter';
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
        <Landing path="/" />
        <PublicCertificate path="/c/:slug" />
        <MyCertificates path="/my-certificates" />
        <TemplatePreview path="/preview/:id" />
      </div>
    </Router>
  );
}