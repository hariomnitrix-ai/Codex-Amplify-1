import type {Candidate,ScoreBreakdown} from './types.js';
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export function scoreCandidate(c:Candidate):ScoreBreakdown {
 const demand=clamp(c.demand.reduce((s,e)=>s+e.value,0)/Math.max(1,c.demand.length));
 const competition=clamp(100-(c.competitors*8+c.medianCompetitorQuality*.45));
 const buyerValue=clamp(Math.log10(Math.max(1,c.estimatedValuePerThousandUsd))*35);
 const feasibility=clamp(105-c.implementationDays*9);
 const durability=clamp(c.durability);
 const riskPenalty=(!c.publicOrPermitted?100:0)+(!c.tosReviewed?25:0)+(!c.robotsReviewed?10:0)+(c.personalData?25:0)+({low:0,medium:15,high:50,unknown:35}[c.risk]);
 const total=clamp(demand*.28+competition*.18+buyerValue*.24+feasibility*.14+durability*.16-riskPenalty);
 const decision=!c.publicOrPermitted||c.risk==='high'?'reject':(!c.tosReviewed||c.risk==='unknown'||total<70?'review':'build');
 return {demand,competition,buyerValue,feasibility,durability,riskPenalty,total,decision};
}
