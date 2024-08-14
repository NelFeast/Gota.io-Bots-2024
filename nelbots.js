class NELFEAST{constructor(){this.ws=null,this.config={server:null,startedBots:!1},this.grecaptcha=null,this.initialize()}initialize(){this.injectElement(),this.injectStyles(),this.injectUIElement(),this.setRecaptcha(),this.webSocketListener(),this.connect()}connect(){this.ws=new WebSocket(serverBots),this.ws.binaryType="arraybuffer",this.ws.onopen=this.onopen.bind(this),this.ws.onclose=this.onclose.bind(this),this.ws.onmessage=this.onmessage.bind(this)}send(a){this.ws?.readyState===WebSocket.OPEN&&this.ws.send(a)}onopen(){document.getElementById("getProxies").disabled=!1,document.getElementById("botCount").innerText=`Ready`,document.getElementById("botCount").style.color=`#fff`,document.getElementById("status").innerText="Connected",document.getElementById("getProxies").innerText="Refresh",document.getElementById("status").style.color="rgb(40, 199, 111)",document.getElementById("botCount").style.color="rgb(40, 199, 111)"}onclose(){this.config.startedBots=!1,document.getElementById("startBots").disabled=!1,document.getElementById("getProxies").disabled=!1,document.getElementById("stopBots").style.display="none",document.getElementById("startBots").style.display="block",document.getElementById("status").style.color="#fff",document.getElementById("botCount").style.color="#fff",document.getElementById("botCount").innerText=`Offline`,document.getElementById("status").innerText="Connecting",document.getElementById("getProxies").innerText="Refresh",this.connect()}onmessage(a){const b=new Reader(a.data),c=b.readUint8();switch(c){case 0:this.config.startedBots=!0;break;case 1:this.config.startedBots=!1,document.getElementById("startBots").disabled=!1,document.getElementById("getProxies").disabled=!1,document.getElementById("botCount").innerText=`Stopped`,document.getElementById("botCount").style.color=`#ea5455`,document.getElementById("stopBots").style.display="none",document.getElementById("startBots").style.display="inline";break;case 2:var d=b.readUint16(),e=b.readUint16(),f=document.getElementById("botCount");f.innerText=`${d}/${e}`,f.style.color=d==e?`rgb(40, 199, 111)`:`#fff`;break;case 3:this.requestCaptchaToken(b);break;case 4:document.getElementById("getProxies").disabled=!1,document.getElementById("getProxies").innerText="Success",document.getElementById("getProxies").style.color="rgb(40, 199, 111)",setTimeout(()=>{document.getElementById("getProxies").style.color="#fff",document.getElementById("getProxies").innerText="Refresh"},2e3);}}setRecaptcha(){let a=setInterval(()=>{window.grecaptcha&&(this.grecaptcha=window.grecaptcha,console.log("Ready"),clearInterval(a))},1e3)}requestCaptchaToken(a){const b=a.readUint8();this.grecaptcha.execute("6LcycFwUAAAAANrun52k-J1_eNnF9zeLvgfJZSY3",{action:"login"}).then(a=>{this.sendCaptchaToken(b,a)})}sendCaptchaToken(a,b){const c=new Writer(4+b.length);c.writeUint8(6),c.writeUint8(a),c.writeString(b),this.send(c.dataView.buffer)}sendServer(){const a=new Writer(3+this.config.server.length);a.writeUint8(0),a.writeString(this.config.server),this.send(a.dataView.buffer)}startBots(){!this.config.startedBots&&this.config.server&&(this.sendServer(),this.send(new Uint8Array([1]).buffer),document.getElementById("startBots").disabled=!0,document.getElementById("getProxies").disabled=!0,document.getElementById("startBots").style.display="none",document.getElementById("stopBots").style.display="block")}stopBots(){this.send(new Uint8Array([2]).buffer)}splitBots(){this.config.startedBots&&this.send(new Uint8Array([3]).buffer)}ejectBots(){this.config.startedBots&&this.send(new Uint8Array([4]).buffer)}sendMouse(a,b){var c=new Writer(13);c.writeUint8(5),c.writeInt32(a),c.writeInt32(b),this.send(c.dataView.buffer)}getProxies(){this.config.startedBots||(this.send(new Uint8Array([7]).buffer),document.getElementById("getProxies").disabled=!0)}webSocketListener(){const a=this,b=window.WebSocket.prototype.send,c=a=>{let b=a.getInt32(1,!0),c=a.getInt32(5,!0);return{x:b,y:c}};window.WebSocket.prototype.send=function(d){if(b.apply(this,arguments),!this.url.includes(serverBots)){const b=new DataView(new Uint8Array(d).buffer),e=b.getUint8(0);if(16===e){const{x:d,y:e}=c(b);a.sendMouse(d,e),a.config.server!==this.url&&(a.config.server=this.url)}}}}injectElement(){const a=document.createElement("div");a.id="_9yryhcrukp",a.style.zIndex="9999",(document.body||document.documentElement).appendChild(a)}injectStyles(){const a=document.createElement("link");a.rel="stylesheet",a.href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",document.head.appendChild(a),document.getElementsByTagName("head")[0].innerHTML+=`
        <style type="text/css">.nf-item h4,.nf-logo h2{font-weight:700}#getProxies,#startBots,.nf-logo a{color:#fff}*{font-family:Inter;margin:0;padding:0}#nf-wrapper{top:0;left:50%;padding:8px;z-index:9999;position:fixed;box-shadow:var(--shadow);transform:translateX(-50%);background-color:rgba(22,22,22,.8);border-bottom:3px solid transparent;border-image:linear-gradient(to right,#E667CA,#5EAEFF,#F67373,#FBB500) 1;border-image-slice:1;animation:3s infinite gradientAnimation}.nf-body{gap:10px;display:flex;min-width:400px;align-items:center;justify-content:space-around}.nf-logo{line-height:20px!important}.nf-logo h2{font-size:23px;letter-spacing:-1px}.nf-logo a{font-size:14px;text-decoration:none}.nf-button{border:none;cursor:pointer;background:0 0;margin-top:.125rem}.nf-button:disabled{opacity:.5;cursor:not-allowed}.nf-button:hover:disabled{transform:none;background-color:transparent}.nf-item{color:#ffff;display:flex;font-size:14px;flex-direction:column;align-items:center;min-width:50px}.nf-active{background-color:#d670c5}#main{margin-top:20px!important}#stopBots{color:#f67373}@keyframes gradientAnimation{0%,100%{border-image-source:linear-gradient(to right,#E667CA,#5EAEFF,#F67373,#FBB500)}25%{border-image-source:linear-gradient(to right,#FBB500,#E667CA,#5EAEFF,#F67373)}50%{border-image-source:linear-gradient(to right,#F67373,#FBB500,#E667CA,#5EAEFF)}75%{border-image-source:linear-gradient(to right,#5EAEFF,#F67373,#FBB500,#E667CA)}}</style>`}injectUIElement(){document.getElementById("_9yryhcrukp").insertAdjacentHTML("beforeend","<div id=nf-wrapper><div class=nf-body><div class=nf-logo><h2><span style=color:#e667ca>N</span><span style=color:#5eaeff>E</span><span style=color:#f67373>L</span><span style=color:#fbb500>B</span><span style=color:#e667ca>O</span><span style=color:#5eaeff>T</span><span style=color:#e667ca>S</span></h2><a href=https://youtube.com/@NelFeast>Best player helper</a></div><div class=nf-item><h4>Status</h4><span id=status>Connecting</span></div><div class=nf-item><h4>Bots</h4><span id=botCount>0/0</span></div><div class=nf-item><h4>Proxies</h4><button type=button class=nf-button id=getProxies onclick=window.server.getProxies()>Refresh</button></div><div class=nf-item><h4>Action</h4><button type=button class=nf-button id=startBots onclick=window.server.startBots()>Start</button><button type=button class=nf-button id=stopBots style=display:none onclick=window.server.stopBots()>Stop</button></div></div></div>"),document.addEventListener("keydown",a=>{switch(a.keyCode){case 69:this.splitBots();break;case 82:this.ejectBots();}})}}window.server=new NELFEAST;