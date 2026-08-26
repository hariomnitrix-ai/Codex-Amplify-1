import type {Approval,TargetConfig} from './types.js'; import {verifyApproval} from './approval.js';
export class ApifyFactoryClient { constructor(private token:string,private base='https://api.apify.com/v2'){} private async call(path:string,init:RequestInit={}){const r=await fetch(`${this.base}${path}`,{...init,headers:{authorization:`Bearer ${this.token}`,'content-type':'application/json',...(init.headers||{})}});if(!r.ok)throw new Error(`Apify API ${r.status}: ${await r.text()}`);return r.json();}
 async createPrivateStage(config:TargetConfig){return this.call('/acts',{method:'POST',body:JSON.stringify({name:config.id,title:config.title,isPublic:false})});}
 async triggerBuild(actorId:string){return this.call(`/acts/${encodeURIComponent(actorId)}/builds?waitForFinish=120`,{method:'POST',body:'{}'});}
 async runSmoke(actorId:string,input:unknown){return this.call(`/acts/${encodeURIComponent(actorId)}/runs?waitForFinish=120`,{method:'POST',body:JSON.stringify(input)});}
 async publishPaid(config:TargetConfig,approval:Approval,secret:string){verifyApproval(approval,config,secret);if(process.env.FACTORY_DRY_RUN!=='false')throw new Error('Dry-run blocks publication');return {authorized:true,actorId:config.id,message:'Approval verified. Complete monetization/publication through the current supported Console/API workflow.'};}
}
