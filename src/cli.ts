import {Command} from 'commander'; import {readFile} from 'node:fs/promises'; import {rankCandidates} from './scanner.js'; import {generateActor,loadTarget} from './generator.js'; import {classifyFailure,maintenanceAction} from './maintenance.js'; import type {Candidate} from './types.js';
const app=new Command().name('actor-factory');
app.command('scan').requiredOption('--fixture <path>').action(async o=>{const x=JSON.parse(await readFile(o.fixture,'utf8')) as Candidate[];console.log(JSON.stringify(rankCandidates(x),null,2));});
app.command('generate').requiredOption('--target <path>').option('--out <path>','output root','generated').action(async o=>console.log(await generateActor(await loadTarget(o.target),o.out)));
app.command('validate').requiredOption('--actor <path>').action(async o=>{for(const p of ['package.json','.actor/actor.json','.actor/INPUT_SCHEMA.json','target.json'])JSON.parse(await readFile(`${o.actor}/${p}`,'utf8'));const readme=await readFile(`${o.actor}/README.md`,'utf8');if(!readme.startsWith('# '))throw new Error('README must start with a title');console.log('validation: passed');});
app.command('maintain').requiredOption('--message <text>').action(o=>{const k=classifyFailure(o.message);console.log(JSON.stringify({kind:k,action:maintenanceAction(k)}));});
app.command('publish').action(()=>{throw new Error('Use the approval API with a signed, unexpired approval record; CLI publication is intentionally disabled.');});
await app.parseAsync();
