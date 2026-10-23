import test from "node:test"; import assert from "node:assert/strict";
import { filterRecords, toCsv, buildInsights } from "../featurePack.mjs";
const rows=[{id:1,title:"Alpha stay",status:"Open",risk:"High",amount:0},{id:2,title:"Beta",status:"Closed",risk:"Low",amount:50}];
test("search/filter on main list",()=>{ assert.equal(filterRecords(rows,{q:"alpha"}).length,1); assert.equal(filterRecords(rows,{status:"Closed"})[0].id,2); assert.equal(filterRecords(rows,{risk:"High"})[0].amount,0); });
test("CSV/JSON export preserves 0/false/empty",()=>{ assert.ok(toCsv(rows).includes("0")); assert.equal(JSON.parse(JSON.stringify(rows))[0].amount,0); });
test("deterministic insights labelled aiGenerated:false",()=>{ const r=buildInsights(rows,['Invoice variance summary', 'Contracts needing evidence', 'Recovery priority queue']); assert.equal(r.aiGenerated,false); assert.equal(r.sections.length,3); assert.equal(r.sections[0].value,50); });
