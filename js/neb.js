/* fundo animado (nebulosa) em WebGL. Cores via data-b, data-c1, data-c2, data-c3 no <canvas id="neb"> (r,g,b de 0 a 1) */
(function(){
const c=document.getElementById('neb');if(!c)return;
const gl=c.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});if(!gl)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const col=k=>(c.dataset[k]||'1,1,1').split(',').map(Number);
const fs=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T;uniform vec2 M;uniform float S;uniform vec3 B;uniform vec3 C1;uniform vec3 C2;uniform vec3 C3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*R)/R.y;p.y-=S*.0004;float t=T*.04;
  vec2 q=vec2(fbm(p*1.4+vec2(0.,t)),fbm(p*1.4+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.6+3.*q+vec2(1.7,9.2)+t*1.3),fbm(p*1.6+3.*q+vec2(8.3,2.8)-t));
  float f=fbm(p*1.3+3.*r+(M-.5)*.3);
  vec3 o=B;
  o=mix(o,C2,smoothstep(.25,.85,length(q))*.5);
  o=mix(o,C1,smoothstep(.32,.8,f)*.95);
  o=mix(o,C3,smoothstep(.5,1.,r.x*r.y*2.2)*.4);
  gl_FragColor=vec4(o,1.);
}`;
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null};
const v=sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'),f=sh(gl.FRAGMENT_SHADER,fs);if(!v||!f)return;
const pg=gl.createProgram();gl.attachShader(pg,v);gl.attachShader(pg,f);gl.linkProgram(pg);gl.useProgram(pg);
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const loc=gl.getAttribLocation(pg,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
const U=n=>gl.getUniformLocation(pg,n);const uR=U('R'),uT=U('T'),uM=U('M'),uS=U('S');
gl.uniform3fv(U('B'),col('b'));gl.uniform3fv(U('C1'),col('c1'));gl.uniform3fv(U('C2'),col('c2'));gl.uniform3fv(U('C3'),col('c3'));
const size=()=>{const k=(innerWidth<760?.28:.5)*Math.min(devicePixelRatio||1,1.5);c.width=Math.max(2,innerWidth*k);c.height=Math.max(2,innerHeight*k);gl.viewport(0,0,c.width,c.height)};size();addEventListener('resize',size);
let mx=.5,my=.5,sx=.5,sy=.5;addEventListener('mousemove',e=>{mx=e.clientX/innerWidth;my=1-e.clientY/innerHeight});
const draw=t=>{sx+=(mx-sx)*.04;sy+=(my-sy)*.04;gl.uniform2f(uR,c.width,c.height);gl.uniform1f(uT,t/1000);gl.uniform2f(uM,sx,sy);gl.uniform1f(uS,scrollY);gl.drawArrays(gl.TRIANGLES,0,3)};
if(reduce){draw(8000);return}
let fr=0;(function loop(t){fr++;if(!document.hidden&&(innerWidth>=760||fr%2===0))draw(t);requestAnimationFrame(loop)})(0);
})();
