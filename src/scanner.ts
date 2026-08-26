import type {Candidate} from './types.js'; import {scoreCandidate} from './scoring.js';
export function rankCandidates(items:Candidate[]){ return items.map(candidate=>({candidate,score:scoreCandidate(candidate)})).sort((a,b)=>b.score.total-a.score.total); }
