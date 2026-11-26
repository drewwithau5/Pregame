import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const h = React.createElement;

const ORIGIN = "North Hills"; // drive minutes in sample data are measured from here
/* ============ DATA LAYER (swap for real API later) ============ */
// Tag convention: category.option[.suboption[.detail]] — a bar satisfies a requirement
// if it has that tag or any tag nested beneath it.
const RAW_BARS = [
 {id:1,hh:[16, 19],hol:["thanksgiving", "nye"],peak:[20, 24],qw:3,pw:15,name:"The Gilded Pint",hood:"Glenwood South",min:10,rating:4.6,e:"🍺",c:["#ff3d7f","#a83dff"],vibe:"Irish pub energy with a proper Guinness pour.",tags:"dr.beer.guinness.glass dr.beer.lager dr.liquor.whiskey dr.liquor.whiskey.rare pe.none ac.darts ba.multi en.nobouncer en.bar en.table en.self dr.beer.taps.20 tv.tvs tv.sports.soccer tv.sports.nfl en.in"},
 {id:2,hh:[17, 20],hol:["halloween"],peak:[21, 25],qw:2,pw:18,name:"Crooked Tar Heel",hood:"Warehouse District",min:14,rating:4.4,e:"🎯",c:["#ffb627","#ff3d7f"],vibe:"Dart leagues, cheap lagers, loud jukebox.",tags:"dr.beer.lager dr.beer.ipa dr.beer.ipa.local dr.beer.guinness ac.darts ac.pool pe.out ba.multi ba.neutral en.nobouncer en.bar en.self dr.beer.taps.20 tv.tvs tv.sports.college en.in en.out"},
 {id:3,hh:[16, 18],hol:["nye", "halloween"],peak:[21, 26],qw:8,pw:40,name:"Neon Oak Social",hood:"Person Street",min:14,rating:4.7,e:"🍸",c:["#2de2c1","#a83dff"],vibe:"Glowing craft cocktails and a sleek patio.",tags:"dr.cocktails.craft dr.cocktails.craft.seasonal dr.cocktails.classic dr.cocktails.frozen dr.wine.red dr.wine.white dr.wine.glass pe.out ba.single ba.neutral ba.private en.bouncer en.cover en.table en.in en.out en.booth en.heat"},
 {id:4,hh:null,hol:["thanksgiving", "halloween"],peak:[18, 22],qw:4,pw:20,name:"Orchard & Ember",hood:"Boylan Heights",min:16,rating:4.8,e:"🍎",c:["#ff7a3d","#ffb627"],vibe:"Cider house with a fire pit and dogs everywhere.",tags:"dr.beer.cider dr.beer.cider.dry dr.beer.cider.sweet dr.beer.cider.tap dr.beer.ipa dr.wine.sparkling pe.in pe.out ba.single ba.neutral ba.private en.nobouncer en.self en.table en.in en.out en.fire en.heat"},
 {id:5,hh:[15, 18],hol:[],peak:[19, 23],qw:3,pw:12,name:"Hop & Holler",hood:"Five Points",min:8,rating:4.5,e:"🐶",c:["#2de2c1","#3d7aff"],vibe:"Dog-friendly taproom with NC brews and bocce.",tags:"dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.cider dr.beer.cider.dry dr.beer.cider.tap ac.bocce pe.in pe.out ba.multi ba.neutral en.nobouncer en.self en.table en.bar dr.beer.taps.20 dr.beer.sour tv.tvs tv.patio en.in en.out en.heat"},
 {id:6,hh:null,hol:["nye", "halloween"],peak:[22, 26],qw:10,pw:45,name:"The Velvet Anchor",hood:"Downtown",min:15,rating:4.3,e:"⚓",c:["#a83dff","#3d1d6b"],vibe:"Moody speakeasy. Bring ID and good shoes.",tags:"dr.cocktails.craft dr.cocktails.classic dr.liquor.whiskey dr.liquor.whiskey.rare dr.liquor.tequila dr.wine.red dr.wine.glass pe.none ba.private ba.single en.bouncer en.cover en.bar en.table en.in en.booth"},
 {id:7,hh:[14, 20],hol:["halloween", "thanksgiving"],peak:[22, 26],qw:2,pw:14,name:"Dive 919",hood:"Hillsborough St",min:15,rating:4.2,e:"🎱",c:["#ff3d7f","#e63946"],vibe:"Sticky floors, pool tables, zero pretension.",tags:"dr.beer.lager dr.beer.guinness dr.liquor.vodka dr.liquor.whiskey ac.pool ac.darts pe.none ba.multi en.nobouncer en.bar en.self tv.tvs tv.sports.ufc tv.sports.nba en.in"},
 {id:8,hh:[17, 19],hol:["halloween"],peak:[20, 24],qw:5,pw:30,name:"Pinball Parish",hood:"Glenwood South",min:10,rating:4.5,e:"🕹️",c:["#3d7aff","#2de2c1"],vibe:"Arcade bar with mini golf upstairs.",tags:"dr.beer.ipa dr.beer.lager dr.cocktails.frozen dr.cocktails.classic ac.golf ac.pool pe.none ba.multi ba.neutral en.cover en.self en.table tv.tvs en.in en.booth"},
 {id:9,hh:[16, 18],hol:["thanksgiving"],peak:[18, 22],qw:4,pw:22,name:"Bocce Barn",hood:"North Hills",min:3,rating:4.6,e:"🌳",c:["#7ad63d","#2de2c1"],vibe:"Sprawling lawn, bocce courts, dogs welcome.",tags:"dr.beer.ipa dr.beer.ipa.local dr.beer.cider dr.beer.cider.sweet dr.wine.white dr.wine.sparkling dr.wine.glass ac.bocce ac.golf pe.out pe.in ba.multi ba.neutral en.nobouncer en.self en.table dr.beer.taps.20 tv.patio tv.big en.out en.fire en.heat"},
 {id:10,hh:[17, 19],hol:["nye"],peak:[21, 25],qw:8,pw:35,name:"Copper Fern Cocktail Co.",hood:"Warehouse District",min:14,rating:4.7,e:"🥃",c:["#ffb627","#7a3d1d"],vibe:"Barrel-aged everything and a velvet back room.",tags:"dr.cocktails.craft dr.cocktails.craft.seasonal dr.liquor.whiskey dr.liquor.whiskey.rare dr.liquor.tequila dr.liquor.tequila.mezcal pe.none ba.single ba.private en.bouncer en.cover en.table en.bar en.in en.booth"},
 {id:11,hh:[16, 19],hol:["thanksgiving", "halloween"],peak:[19, 23],qw:4,pw:25,name:"The Last Inning",hood:"Five Points",min:9,rating:4.1,e:"⚾",c:["#e63946","#ffb627"],vibe:"Sports bar with bar-top seating and cold pitchers.",tags:"dr.beer.lager dr.beer.ipa dr.beer.guinness dr.liquor.vodka dr.liquor.tequila ac.darts pe.none ba.multi en.nobouncer en.bar en.self dr.beer.taps.20 tv.tvs tv.tvs.many tv.tvs.sound tv.big tv.sports.nfl tv.sports.nba tv.sports.college tv.sports.ufc tv.sports.soccer tv.sports.request en.in en.booth"},
 {id:12,hh:[16, 18],hol:["nye"],peak:[20, 24],qw:5,pw:20,name:"Saint Bramble's",hood:"Person Street",min:14,rating:4.4,e:"🍷",c:["#a83dff","#ff3d7f"],vibe:"Candlelit wine bar that gets surprisingly rowdy.",tags:"dr.wine.red dr.wine.white dr.wine.sparkling dr.wine.glass dr.cocktails.classic dr.beer.lager pe.in ba.private ba.single en.bouncer en.table en.bar en.in en.booth"},
 {id:13,hh:[15, 19],hol:["thanksgiving", "nye", "halloween"],peak:[19, 24],qw:6,pw:28,name:"Sidelines Social",hood:"Glenwood South",min:10,rating:4.4,e:"🏈",c:["#3d7aff","#ff3d7f"],vibe:"40 TVs, sound on, and they'll put any game on for you.",tags:"dr.beer.lager dr.beer.ipa dr.beer.taps.20 dr.cocktails.frozen dr.liquor.vodka dr.liquor.tequila pe.out ac.pool en.self en.table en.bar tv.tvs tv.tvs.many tv.tvs.sound tv.big tv.patio tv.sports.nfl tv.sports.nba tv.sports.college tv.sports.soccer tv.sports.ufc tv.sports.request en.in en.out en.booth en.heat"},
 {id:14,hh:[15, 18],hol:["halloween", "thanksgiving"],peak:[17, 22],qw:3,pw:16,name:"The Tap Yard Beer Garden",hood:"Warehouse District",min:14,rating:4.8,e:"🍻",c:["#7ad63d","#ffb627"],vibe:"150 taps, picnic tables and a very happy dog patio.",tags:"dr.beer.taps.20 dr.beer.taps.100 dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.guinness dr.beer.sour dr.beer.cider dr.beer.cider.dry dr.beer.cider.sweet dr.beer.cider.tap pe.in pe.out ac.bocce en.self en.table en.bar tv.patio en.out en.fire en.heat"},
 {id:15,hh:[17, 19],hol:["nye"],peak:[21, 25],qw:6,pw:28,name:"Midtown Rye",hood:"Midtown",min:4,rating:4.5,e:"🥃",c:["#ffb627","#7a3d1d"],vibe:"Whiskey library with leather booths and zero TVs.",tags:"dr.liquor.whiskey dr.liquor.whiskey.rare dr.cocktails.craft dr.cocktails.classic dr.wine.red pe.none en.bar en.table en.in en.booth"},
 {id:16,hh:[15, 18],hol:["thanksgiving", "halloween"],peak:[19, 23],qw:4,pw:22,name:"Fenton Tap & Table",hood:"Fenton, Cary",min:28,rating:4.4,e:"🍻",c:["#2de2c1","#3d7aff"],vibe:"Open-air taproom steps from the shops.",tags:"dr.beer.taps.20 dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.sour dr.cocktails.craft dr.wine.white dr.wine.red dr.wine.glass pe.out tv.tvs tv.patio tv.big en.self en.table en.bar en.in en.out en.heat"},
 {id:17,hh:[16, 18],hol:["thanksgiving", "halloween"],peak:[17, 21],qw:3,pw:14,name:"Maple Hollow Cider Works",hood:"Cary, NC",min:27,rating:4.7,e:"🍏",c:["#7ad63d","#ff7a3d"],vibe:"Orchard-style cider bar with lawn games and pups.",tags:"dr.beer.cider dr.beer.cider.dry dr.beer.cider.sweet dr.beer.cider.tap dr.beer.lager dr.wine.sparkling pe.out pe.in ac.bocce en.self en.table en.in en.out en.fire en.heat"},
 {id:18,hh:[16, 19],hol:["nye"],peak:[20, 24],qw:7,pw:30,name:"Cameron Village Social Club",hood:"Cameron Village",min:11,rating:4.3,e:"🥂",c:["#a83dff","#ff3d7f"],vibe:"Polished wine-and-cocktail hangout.",tags:"dr.cocktails.craft dr.cocktails.classic dr.cocktails.craft.seasonal dr.wine.red dr.wine.white dr.wine.sparkling dr.wine.glass pe.none en.bar en.table en.cover en.in en.booth"},
 {id:19,hh:[16, 20],hol:["halloween", "thanksgiving"],peak:[22, 26],qw:3,pw:24,name:"Glenwood Ave Tavern",hood:"Glenwood Ave",min:9,rating:4.2,e:"🎸",c:["#ff3d7f","#ffb627"],vibe:"Loud, local and always a pool table open.",tags:"dr.beer.lager dr.beer.ipa dr.beer.guinness dr.liquor.vodka dr.liquor.tequila ac.darts ac.pool pe.none en.bar en.self tv.tvs tv.tvs.many tv.tvs.sound tv.sports.nfl tv.sports.college tv.sports.nba tv.sports.soccer en.in"},
 {id:20,hh:[17, 19],hol:["nye", "halloween"],peak:[21, 26],qw:12,pw:45,name:"Neon Frog Rooftop",hood:"Glenwood South",min:10,rating:4.6,e:"🐸",c:["#2de2c1","#a83dff"],vibe:"Rooftop frozen cocktails with skyline views.",tags:"dr.cocktails.craft dr.cocktails.frozen dr.cocktails.classic dr.liquor.tequila dr.liquor.tequila.mezcal dr.liquor.whiskey pe.none en.cover en.table en.out en.heat"},
 {id:21,hh:[15, 18],hol:["thanksgiving"],peak:[18, 23],qw:5,pw:26,name:"Brier Creek Brewhouse",hood:"Brier Creek",min:19,rating:4.3,e:"🏟️",c:["#3d7aff","#ffb627"],vibe:"100 taps and a wall of screens.",tags:"dr.beer.taps.20 dr.beer.taps.100 dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.sour dr.beer.guinness pe.in pe.out tv.tvs tv.tvs.many tv.tvs.sound tv.sports.nfl tv.sports.college tv.sports.nba tv.sports.soccer tv.sports.request tv.big tv.patio en.bar en.self en.table en.in en.out en.booth en.heat"},
 {id:22,hh:[14, 19],hol:["halloween"],peak:[22, 26],qw:2,pw:12,name:"The Rusty Cue",hood:"Hillsborough St",min:14,rating:4.1,e:"🎱",c:["#e63946","#ff3d7f"],vibe:"Campus dive with cheap pitchers.",tags:"dr.beer.lager dr.liquor.vodka ac.pool ac.darts pe.none en.bar en.self tv.tvs tv.sports.ufc tv.sports.nba en.in en.booth"},
 {id:23,hh:[15, 18],hol:["nye", "thanksgiving"],peak:[17, 21],qw:3,pw:15,name:"Wake Forest Rd Wine Garden",hood:"North Raleigh",min:6,rating:4.6,e:"🍇",c:["#a83dff","#7ad63d"],vibe:"Vine-draped patio with bocce and bottle service.",tags:"dr.wine.red dr.wine.white dr.wine.sparkling dr.wine.glass dr.cocktails.classic pe.out pe.in ac.bocce en.self en.table en.out en.fire en.heat"},
 {id:24,hh:[17, 19],hol:["nye", "halloween"],peak:[21, 26],qw:9,pw:38,name:"Moonshine Social",hood:"Downtown",min:15,rating:4.5,e:"🌙",c:["#3d1d6b","#ffb627"],vibe:"Candlelit rare pours, tucked off Fayetteville St.",tags:"dr.liquor.whiskey dr.liquor.whiskey.rare dr.cocktails.craft dr.cocktails.classic dr.cocktails.craft.seasonal dr.liquor.tequila dr.liquor.tequila.mezcal pe.none en.cover en.bar en.in en.booth"},
 {id:25,hh:[16, 19],hol:["halloween", "thanksgiving"],peak:[19, 23],qw:4,pw:20,name:"Pine State Pub",hood:"Five Points",min:8,rating:4.4,e:"🌲",c:["#2de2c1","#3d7aff"],vibe:"NC beer, college football, friendly regulars.",tags:"dr.beer.lager dr.beer.ipa dr.beer.ipa.local dr.beer.guinness dr.beer.sour dr.beer.taps.20 pe.in pe.out ac.darts tv.tvs tv.sports.college tv.sports.nfl en.bar en.table en.self en.in en.out en.heat"},
 {id:26,hh:[17, 19],hol:["halloween"],peak:[20, 24],qw:6,pw:32,name:"Iron Horse Arcade Bar",hood:"Warehouse District",min:14,rating:4.5,e:"🎮",c:["#ff3d7f","#3d7aff"],vibe:"Retro cabinets, mini golf and frozen drinks.",tags:"dr.beer.ipa dr.beer.lager dr.cocktails.frozen dr.cocktails.classic dr.cocktails.craft ac.golf ac.pool ac.darts pe.none en.cover en.self en.table en.in en.booth"},
 {id:27,hh:[16, 19],hol:["halloween"],peak:[18, 22],qw:4,pw:20,name:"Triangle Tiki Hut",hood:"Fenton, Cary",min:28,rating:4.5,e:"🌴",c:["#ffb627","#ff3d7f"],vibe:"Tiki mugs, string lights, and a bocce court.",tags:"dr.cocktails.frozen dr.cocktails.classic dr.cocktails.craft dr.cocktails.craft.seasonal dr.liquor.tequila pe.out ac.bocce en.self en.table en.bar en.in en.out en.fire en.heat"},
 {id:28,hh:[15, 18],hol:["thanksgiving"],peak:[18, 22],qw:3,pw:15,name:"Falls of Neuse Taproom",hood:"North Raleigh",min:8,rating:4.3,e:"🍂",c:["#ff7a3d","#7a3d1d"],vibe:"Family-run taproom with a cider tap and patio game day.",tags:"dr.beer.taps.20 dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.cider dr.beer.cider.dry dr.beer.cider.tap pe.out pe.in tv.tvs tv.patio tv.sports.college tv.sports.nfl ac.bocce en.self en.table en.bar en.in en.out en.fire en.heat"},
 {id:29,hh:[16, 18],hol:["nye"],peak:[20, 24],qw:6,pw:28,name:"Crabtree Cocktail Parlor",hood:"Crabtree",min:9,rating:4.4,e:"🍹",c:["#ff3d7f","#a83dff"],vibe:"Seasonal menus and date-night energy.",tags:"dr.cocktails.craft dr.cocktails.classic dr.cocktails.craft.seasonal dr.wine.red dr.wine.white dr.wine.glass dr.wine.sparkling dr.liquor.whiskey pe.none en.bar en.table en.cover en.in en.booth"},
 {id:30,hh:[15, 19],hol:["thanksgiving", "halloween", "nye"],peak:[19, 24],qw:5,pw:30,name:"Capital Blvd Sports Grill",hood:"Capital Blvd",min:8,rating:4.2,e:"🏟️",c:["#e63946","#3d7aff"],vibe:"Every sport, every night, every screen.",tags:"dr.beer.lager dr.beer.ipa dr.beer.guinness dr.beer.taps.20 dr.liquor.vodka dr.liquor.tequila dr.liquor.whiskey ac.darts ac.pool pe.none tv.tvs tv.tvs.many tv.tvs.sound tv.sports.nfl tv.sports.college tv.sports.nba tv.sports.soccer tv.sports.ufc tv.sports.request tv.big tv.patio en.bar en.self en.table en.in en.out en.booth en.heat"},
 {id:31,hh:[17, 20],hol:["halloween"],peak:[22, 26],qw:3,pw:20,name:"Nowhere Special",hood:"Glenwood South",min:10,rating:4.3,e:"🎤",c:["#a83dff","#ff3d7f"],vibe:"Karaoke, slushy cocktails and bad decisions.",tags:"dr.beer.lager dr.beer.ipa dr.cocktails.frozen dr.liquor.vodka ac.pool pe.none en.bar en.self en.in en.booth"},
 {id:32,hh:[15, 18],hol:["halloween", "thanksgiving"],peak:[17, 22],qw:4,pw:18,name:"Cary Green Taphouse",hood:"Cary, NC",min:26,rating:4.6,e:"🌿",c:["#7ad63d","#2de2c1"],vibe:"150 taps, a mini golf green and dog-friendly decks.",tags:"dr.beer.taps.20 dr.beer.taps.100 dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.sour dr.beer.guinness dr.beer.cider dr.beer.cider.dry dr.beer.cider.tap pe.out pe.in ac.bocce ac.golf tv.tvs tv.patio tv.big tv.sports.college tv.sports.nfl en.self en.table en.bar en.in en.out en.fire en.heat"},
 {id:33,hh:[16, 18],hol:["nye"],peak:[20, 24],qw:7,pw:30,name:"The Lantern Room",hood:"North Hills",min:2,rating:4.6,e:"🏮",c:["#ffb627","#ff3d7f"],vibe:"Glowing cocktail lounge tucked above the shops.",tags:"dr.cocktails.craft dr.cocktails.craft.seasonal dr.cocktails.classic dr.wine.red dr.wine.white dr.wine.glass dr.wine.sparkling pe.none en.bar en.table en.in en.booth"},
 {id:34,hh:[15, 19],hol:["thanksgiving", "halloween"],peak:[19, 23],qw:5,pw:26,name:"North Hills Taphouse",hood:"North Hills",min:3,rating:4.4,e:"🍺",c:["#2de2c1","#3d7aff"],vibe:"Big patio, bigger tap wall, every game on.",tags:"dr.beer.taps.20 dr.beer.ipa dr.beer.ipa.local dr.beer.lager dr.beer.guinness dr.beer.cider dr.beer.cider.dry dr.beer.cider.tap pe.in pe.out tv.tvs tv.tvs.many tv.tvs.sound tv.big tv.sports.nfl tv.sports.college tv.sports.nba tv.sports.soccer tv.sports.request en.bar en.self en.table en.in en.out en.fire en.booth en.heat"},
 {id:35,hh:[16, 19],hol:["halloween"],peak:[21, 25],qw:4,pw:22,name:"Six Forks Social",hood:"Six Forks Rd",min:5,rating:4.3,e:"🎳",c:["#a83dff","#ffb627"],vibe:"Pool, darts and frozen drinks on the way to everywhere.",tags:"dr.beer.lager dr.beer.ipa dr.beer.guinness dr.cocktails.frozen dr.liquor.vodka dr.liquor.tequila ac.pool ac.darts pe.out tv.tvs tv.patio tv.sports.nfl tv.sports.college en.self en.bar en.table en.in en.out en.heat"}
];
const BarService = { // replace body with fetch() later
  getBars: async () => RAW_BARS.map(b => ({...b, tags: [...b.tags.split(" "), ...(b.hh ? ["dw.hh"] : []), ...b.hol.map(k => "dw.holiday." + k)]}))
};

/* ============ FILTER SCHEMA ============ */
const YN = (id, l) => [[id,"Yes",l],["","No"]];
const leaf = (id,label,e,asks) => ({id,label,e,asks});
const CATS = [
 {id:"dr",label:"Drinks",e:"🍻",kids:[
  {id:"dr.beer",label:"Beer",e:"🍺",asks:[{k:"taps",q:"How big a tap list do you need?",o:[["taps.20","20+ taps","20+ taps"],["taps.100","100+ taps","100+ taps"],["","Any size"]]}],kids:[
   leaf("dr.beer.guinness","Guinness","🖤",[{k:"glass",q:"Does it have to be served in a Guinness glass?",o:YN("glass","Guinness glass")}]),
   leaf("dr.beer.ipa","IPA","🌿",[{k:"local",q:"Only NC craft breweries?",o:YN("local","NC craft IPA")}]),
   leaf("dr.beer.lager","Lager","🥨"),leaf("dr.beer.sour","Sour / wild","🍋"),
   leaf("dr.beer.cider","Cider","🍎",[
    {k:"style",q:"Dry or sweet?",o:[["dry","Dry","Dry cider"],["sweet","Sweet","Sweet cider"],["","Either"]]},
    {k:"tap",q:"Does the cider need to be on tap?",o:YN("tap","Cider on tap")}])]},
  {id:"dr.wine",label:"Wine",e:"🍷",asks:[{k:"glass",q:"Must they pour wine by the glass?",o:YN("glass","Wine by the glass")}],kids:[
   leaf("dr.wine.red","Red","🔴"),leaf("dr.wine.white","White","⚪"),leaf("dr.wine.sparkling","Sparkling","🍾")]},
  {id:"dr.liquor",label:"Liquor",e:"🥃",kids:[
   leaf("dr.liquor.whiskey","Whiskey","🥃",[{k:"rare",q:"Want rare / top-shelf pours?",o:YN("rare","Rare whiskey")}]),
   leaf("dr.liquor.tequila","Tequila","🌵",[{k:"mezcal",q:"Mezcal on the menu?",o:YN("mezcal","Mezcal")}]),
   leaf("dr.liquor.vodka","Vodka","🧊")]},
  {id:"dr.cocktails",label:"Cocktails",e:"🍸",kids:[
   leaf("dr.cocktails.classic","Classic","🍸"),leaf("dr.cocktails.frozen","Frozen","🍹"),
   leaf("dr.cocktails.craft","Craft","🧪",[{k:"seasonal",q:"Rotating seasonal menu?",o:YN("seasonal","Seasonal menu")}])]}]},
 {id:"pe",label:"Pets",e:"🐶",single:true,kids:[leaf("pe.in","Dogs inside","🐕"),leaf("pe.out","Dogs outside","🌤️"),leaf("pe.none","No dogs","🚫")]},
 {id:"ac",label:"Activities",e:"🎯",kids:[leaf("ac.darts","Darts","🎯"),leaf("ac.pool","Pool","🎱"),leaf("ac.bocce","Bocce","🥎"),leaf("ac.golf","Mini golf","⛳")]},
 {id:"tv",label:"TVs",e:"📺",kids:[leaf("tv.tvs","Has TVs","📺",[{k:"many",q:"Lots of screens (10+)?",o:YN("many","10+ TVs")},{k:"sound",q:"Game sound on?",o:YN("sound","Sound on")}]),leaf("tv.big","Big screen","🎬"),leaf("tv.patio","Patio TVs","🌤️"),{id:"tv.sports",label:"Specific sport",e:"🏆",asks:[{k:"request",q:"Must they put any game on by request?",o:YN("request","Game on request")}],kids:[leaf("tv.sports.nfl","NFL","🏈"),leaf("tv.sports.college","College","🎓"),leaf("tv.sports.nba","NBA","🏀"),leaf("tv.sports.soccer","Soccer","⚽"),leaf("tv.sports.ufc","UFC","🥊")]}]},
 {id:"en",label:"Seating",e:"🪑",kids:[leaf("en.out","Outdoors","🌳"),leaf("en.in","Indoors","🏠"),leaf("en.fire","Fire pits","🔥"),leaf("en.heat","Heaters","♨️"),leaf("en.booth","Booths","🛋️"),leaf("en.bar","Bar seating","🍺"),leaf("en.table","Table seating","🪑")]}
];
const INDEX = {}; (function f(ns){ns.forEach(n=>{INDEX[n.id]=n; n.kids&&f(n.kids)})})(CATS);

/* ============ MATCHING ENGINE (pure) ============ */
const has = (bar, tag) => bar.tags.some(t => t === tag || t.startsWith(tag + "."));
function buildReqs(sel, ans) {
  const reqs = sel.filter(id => !sel.some(o => o !== id && o.startsWith(id + "."))).map(id => ({tag:id,label:INDEX[id].label}));
  Object.entries(ans).forEach(([key, v]) => {
    if (!v) return;
    const nid = key.slice(0, key.lastIndexOf(".")), k = key.slice(key.lastIndexOf(".")+1);
    const a = INDEX[nid].asks.find(x => x.k === k), o = a.o.find(x => x[0] === v);
    reqs.push({tag: nid + "." + v, label: o[2]});
  });
  return reqs;
}
// walk time is derived from drive time for sample data; real API can supply both
const trip = (b, mode) => mode === "walk" ? Math.round(b.min * 2.4) : b.min;
/* timing model: hours are 24h (25 = 1am). Real data can supply hourly busyness instead */
const HOL = {halloween:"🎃 Halloween",thanksgiving:"🦃 Thanksgiving eve",nye:"🎆 New Year's Eve"};
const fmtH = h => { const x = h % 24; return (x % 12 || 12) + (x >= 12 ? "p" : "a"); };
const fmtT = m => { m = ((m % 1440) + 1440) % 1440; const H = Math.floor(m / 60); return (H % 12 || 12) + ":" + String(m % 60).padStart(2,"0") + (H >= 12 ? " PM" : " AM"); };
const waitAt = (b, h) => { h = Math.floor(h); const [ps, pe] = b.peak; return h >= ps && h < pe ? b.pw : (h === ps - 1 || h === pe) ? Math.round((b.qw + b.pw) / 2) : b.qw; };
const inHH = (b, h) => !!b.hh && h >= b.hh[0] && h < b.hh[1];
const enrich = (bars, nowH, mode) => bars.map(b => { const arr = nowH + trip(b, mode) / 60, w = waitAt(b, arr), t = [...b.tags];
  if (inHH(b, arr)) t.push("dw.hh.now"); if (w <= 10) t.push("dw.wait"); if (w <= 5) t.push("dw.wait.5");
  return {...b, tags: t, arr, w}; });
const inRange = (bars, mins, mode) => bars.filter(b => trip(b, mode) <= mins);
const matches = (bars, reqs) => bars.filter(b => reqs.every(r => has(b, r.tag)));
function rank(bars, reqs) {
  return bars.map(b => { const met = reqs.map(r => ({...r, ok: has(b, r.tag)}));
    return {bar:b, met, score: met.filter(m => m.ok).length}; })
   .sort((a,b) => b.score - a.score || a.bar.min - b.bar.min).slice(0,5);
}

/* ============ UI ============ */
function Welcome({ onGo }) {
  return h("div", {className:"scr wc"},
    h("div", {className:"wel"}, "Welcome to"),
    h("div", {className:"logo"}, "pregame"),
    h("div", {className:"stitch"}),
    h("div", {className:"tag"}, "Find the right bar for the whole crew"),
    h("button", {className:"go", onClick:onGo}, "Continue 🍻"));
}

function Loader({ onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => { const a = setTimeout(() => setOut(true), 2800), b = setTimeout(onDone, 3400); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  const pts = "20,10 100,10 90,150 30,150";
  return h("div", {className:"scr load" + (out ? " out" : "")},
    h("svg", {width:170, height:230, viewBox:"-10 0 140 160"},
      h("defs", null, h("clipPath", {id:"gc"}, h("polygon", {points:pts}))),
      h("g", {clipPath:"url(#gc)"},
        h("g", {className:"fill"},
          h("rect", {x:0, y:20, width:120, height:150, fill:"#ffb627"}),
          h("rect", {x:0, y:20, width:120, height:150, fill:"url(#none)"}),
          [30,50,70,88].map((x,i) => h("circle", {key:i, className:"bub", cx:x, cy:140, r:2.5+i%2, fill:"#fff8", style:{animationDelay:i*.35+"s"}})),
          h("rect", {x:10, y:6, width:110, height:18, rx:9, fill:"#fff6df"}))),
      h("polygon", {points:pts, fill:"#ffffff12", stroke:"#fff", strokeWidth:4, strokeLinejoin:"round"})),
    h("div", {className:"lt"}, "Pouring your picks…"));
}

function Count({ n }) { return h("div", {className:"cnt"}, h("b", {key:n}, n), h("span", null, n === 1 ? "bar matches" : "bars match")); }

function Chip({ n, on, onClick }) {
  return h("button", {className:"chip" + (on ? " on" : ""), onClick}, n.e + " " + n.label);
}

function Level({ nodes, sel, ans, toggle, setAns }) {
  const selected = nodes.filter(n => sel.includes(n.id));
  return h(React.Fragment, null,
    h("div", {className:"chips"}, nodes.map(n => h(Chip, {key:n.id, n, on:sel.includes(n.id), onClick:() => toggle(n)}))),
    selected.map(n => h(React.Fragment, {key:n.id},
      n.kids && h("div", {className:"sub"}, h("div", {className:"lbl"}, "Which " + n.label.toLowerCase() + "?"),
        h(Level, {nodes:n.kids, sel, ans, toggle, setAns})),
      n.asks && n.asks.map(a => { const key = n.id + "." + a.k;
        return h("div", {className:"ask", key},
          h("p", null, a.q),
          h("div", {className:"chips"}, a.o.map(o => h("button", {key:o[1], className:"chip" + (ans[key] === o[0] ? " on" : ""), onClick:() => setAns(key, o[0])}, o[1])))); }))));
}

function Home({ mode, setMode, mins, setMins, sel, ans, toggle, setAns, reset, count, go }) {
  const [tab, setTab] = useState("dr");
  const cat = CATS.find(c => c.id === tab);
  const nSel = id => sel.filter(s => s.startsWith(id + ".")).length;
  return h("div", {className:"scr"},
    h("div", {className:"scroll"},
      h("div", {className:"hero"}, h("div", {className:"logo sm"}, "pregame"), h("div", {className:"stitch"}), h("div", {className:"origin"}, "📍 Starting from " + ORIGIN)),
      h("h2", null, "How far will you go?", h("small", null, "Travel time from where you're starting")),
      h("div", {className:"mode"}, [["drive","🚗 Drive"],["walk","🚶 Walk"]].map(([k,l]) => h("button", {key:k, className:"md" + (mode === k ? " on" : ""), onClick:() => setMode(k)}, l))),
      h("div", {className:"times"}, [5,10,15,20,30].map(m => h("button", {key:m, className:"t" + (mins === m ? " on" : ""), onClick:() => setMins(m)}, m, h("small", null, "min")))),
      h("h2", null, "Get picky", h("small", null, "Pick a category, then dial in the details")),
      h("div", {className:"tabs"}, CATS.map(c => h("button", {key:c.id, className:"tab" + (tab === c.id ? " on" : ""), onClick:() => setTab(c.id)}, c.e + " " + c.label, nSel(c.id) > 0 && h("span", {className:"badge"}, nSel(c.id))))),
      h("div", {className:"panel", key:tab}, h(Level, {nodes:cat.kids, sel, ans, toggle, setAns})),
      h("button", {className:"rst", onClick:reset}, "Reset all filters")),
    h("div", {className:"bar"}, h(Count, {n:count}), h("button", {className:"go", onClick:go}, "Find my bars 🍻")));
}

function Timing({ bar, mode }) {
  const hrs = [17,18,19,20,21,22,23,24,25], t = trip(bar, mode), w = bar.w, fa = Math.floor(bar.arr);
  const early = hrs.filter(x => x < fa && waitAt(bar, x) <= 10).pop();
  return h("div", {className:"tm"},
    h("div", {className:"lv"}, "🕒 Leave now, arrive ~" + fmtT(bar.arr * 60)),
    h("div", {className:"wt"}, t + " min " + (mode === "walk" ? "walk" : "drive") + " · ~" + w + " min wait at the bar · peak " + fmtH(bar.peak[0]) + "–" + fmtH(bar.peak[1])),
    h("div", {className:"cr"}, hrs.map(x => h("i", {key:x, className:(waitAt(bar, x) >= bar.pw * .7 ? "p " : "") + (x === fa ? "a" : ""), style:{height:(6 + 28 * waitAt(bar, x) / bar.pw) + "px"}}))),
    h("div", {className:"cl"}, h("span", null, "5p"), h("span", null, "9p"), h("span", null, "1a")),
    w > 10 && early && h("div", {className:"tip"}, "💡 Quieter before " + fmtH(bar.peak[0]) + " (~" + waitAt(bar, early) + " min wait)"));
}

function Results({ mode, bars, reqs, back }) {
  const ranked = rank(bars, reqs), perfect = ranked.filter(r => r.score === reqs.length).length;
  return h("div", {className:"scr"},
    h("div", {className:"rh"}, h("button", {className:"back", onClick:back}, "← Tweak filters"),
      h("h1", null, perfect ? "Tonight's lineup" : "Closest calls"),
      h("p", null, perfect ? perfect + " perfect match" + (perfect > 1 ? "es" : "") + " in your range" : "Nothing nails everything — here's the nearest")),
    h("div", {className:"res"},
      !ranked.length && h("div", {className:"empty"}, "No bars in that travel range. Try a longer trip!"),
      ranked.map(({bar, met, score}, i) => h("div", {className:"bc", key:bar.id, style:{animationDelay:i*.1+"s"}},
        h("div", {className:"ban", style:{background:`linear-gradient(135deg,${bar.c[0]},${bar.c[1]})`}}, h("div", null, bar.e), h("span", null, (mode === "walk" ? "🚶 " : "🚗 ") + trip(bar, mode) + " min · ⭐ " + bar.rating)),
        h("div", {className:"bb"},
          h("h3", null, bar.name), h("div", {className:"m"}, (bar.hood.includes(",") ? bar.hood : bar.hood + ", Raleigh")), h("p", {className:"v"}, bar.vibe), h(Timing, {bar, mode}),
          (bar.hh || bar.hol.length > 0) && h("div", {className:"dl"}, bar.hh && h("span", {className:"r " + (inHH(bar, bar.arr) ? "y" : "d")}, "🍹 Happy hour " + fmtH(bar.hh[0]) + "–" + fmtH(bar.hh[1]) + (inHH(bar, bar.arr) ? " · on at arrival" : "")), bar.hol.map(k => h("span", {key:k, className:"r d"}, HOL[k]))),
          reqs.length > 0 && h("div", {className:"sc" + (score < reqs.length ? " part" : "")}, score === reqs.length ? "✓ Hits every requirement" : score + " of " + reqs.length + " requirements"),
          met.map(m => h("span", {key:m.tag, className:"r " + (m.ok ? "y" : "n")}, (m.ok ? "✓ " : "") + m.label)))))));
}

function App() {
  const [phase, setPhase] = useState("welcome");
  const [bars, setBars] = useState([]);
  const [mins, setMins] = useState(10);
  const [mode, setMode] = useState("drive");
  // "now" in hours (1am = 25). Arrival time at each bar = now + that bar's travel time.
  const [nowH] = useState(() => { const d = new Date(), h = d.getHours() + d.getMinutes() / 60; return h < 6 ? h + 24 : h; });
  const [sel, setSel] = useState([]);
  const [ans, setAnsState] = useState({});
  useEffect(() => { BarService.getBars().then(setBars); }, []);

  const toggle = n => {
    const drop = id => id === n.id || id.startsWith(n.id + ".");
    if (sel.includes(n.id)) { setSel(sel.filter(id => !drop(id))); setAnsState(Object.fromEntries(Object.entries(ans).filter(([k]) => !k.startsWith(n.id + ".")))); return; }
    const cat = CATS.find(c => n.id.startsWith(c.id + "."));
    setSel([...(cat.single ? sel.filter(id => !id.startsWith(cat.id + ".")) : sel), n.id]);
  };
  const setAns = (k, v) => setAnsState({...ans, [k]: v});
  const reset = () => { setSel([]); setAnsState({}); };

  const reqs = useMemo(() => buildReqs(sel, ans), [sel, ans]);
  const pool = useMemo(() => enrich(inRange(bars, mins, mode), nowH, mode), [bars, mins, mode, nowH]);
  const count = useMemo(() => matches(pool, reqs).length, [pool, reqs]);

  return h("div", {className:"app"},
    phase === "welcome" && h(Welcome, {onGo:() => setPhase("home")}),
    phase === "load" && h(Loader, {onDone:() => setPhase("results")}),
    phase === "home" && h(Home, {mode, setMode, mins, setMins, sel, ans, toggle, setAns, reset, count, go:() => setPhase("load")}),
    phase === "results" && h(Results, {mode, bars:pool, reqs, back:() => setPhase("home")}));
}
ReactDOM.createRoot(document.getElementById("root")).render(h(App));

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
