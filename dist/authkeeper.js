!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.authkeeper=t():e.authkeeper=t()}(self,(()=>(()=>{"use strict";var e={d:(t,r)=>{for(var o in r)e.o(r,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:r[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{OAuthClient:()=>o});const r=class{static generateRandomString(e=28){const t=new Uint32Array(e);return window.crypto.getRandomValues(t),Array.from(t,(e=>("0"+e.toString(16)).substr(-2))).join("")}static base64urlencode(e){return btoa(String.fromCharCode.apply(null,new Uint8Array(e))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}static async sha256(e){const t=(new TextEncoder).encode(e);return window.crypto.subtle.digest("SHA-256",t)}static async pkceChallengeFromVerifier(e){const t=await this.sha256(e);return this.base64urlencode(t)}static parseQueryString(e){const t=new URLSearchParams(e),r={};for(let[e,o]of t.entries())r[e]=o;return r}};class o{constructor(e){this.client_id=e.client_id,this.client_secret=e.client_secret,this.redirect_uri=e.redirect_uri,this.authorization_url=e.authorization_url,this.token_url=e.token_url,this.scope=e.scope}async startAuthFlow(){const e=r.generateRandomString();localStorage.setItem("pkce_state",e);const t=r.generateRandomString();localStorage.setItem("pkce_code_verifier",t);const o=await r.pkceChallengeFromVerifier(t),n=`${this.authorization_url}?response_type=code&client_id=${encodeURIComponent(this.client_id)}&state=${encodeURIComponent(e)}&scope=${encodeURIComponent(this.scope)}&redirect_uri=${encodeURIComponent(this.redirect_uri)}&code_challenge=${encodeURIComponent(o)}&code_challenge_method=S256`;window.location=n}async handleCallback(){const e=r.parseQueryString(window.location.search.substring(1));e.error&&alert("Error: "+e.error),e.code&&(localStorage.getItem("pkce_state")!==e.state?alert("Invalid state"):await this.exchangeAuthCodeForToken(e.code)),localStorage.removeItem("pkce_state"),localStorage.removeItem("pkce_code_verifier")}async exchangeAuthCodeForToken(e){const t=localStorage.getItem("pkce_code_verifier");if(!t)return console.error("Code verifier is missing from localStorage."),null;const r=new URL("/api/v2/",this.token_url).origin,o={client_id:this.client_id,client_secret:this.client_secret,grant_type:"authorization_code",code:e,redirect_uri:this.redirect_uri,code_verifier:t,audience:r};try{const e=await fetch(this.token_url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!e.ok){const t=await e.text();return console.error("Token exchange failed with status:",e.status,"Response:",t),null}const t=await e.json();return t?(localStorage.setItem("auth_token",JSON.stringify(t)),t):(console.error("No token data returned."),null)}catch(e){return console.error("Error during token exchange:",e),null}}}return t})()));
//# sourceMappingURL=authkeeper.js.map