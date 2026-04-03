export const MAP_SOURCES: Record<MapScope, string> = {
  world: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  asia: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  africa: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  europe: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  "north-america": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  "south-america": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  oceania: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  india: "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States",
  odisha: "https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/state_ut/odisha/district/odisha_district.json"
};

export type MapType = "political" | "physical" | "climatic" | "capitals" | "rivers";
export type MapScope = "world" | "asia" | "africa" | "europe" | "north-america" | "south-america" | "oceania" | "india" | "odisha";

export const RIVER_SOURCES: Partial<Record<MapScope, string>> = {
  india: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson",
  world: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_rivers_lake_centerlines.geojson",
};

export const LAKE_SOURCES: Partial<Record<MapScope, string>> = {
  india: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson",
};

export interface Question {
  id: string;
  text: string;
  targetId: string; // ID in TopoJSON
  targetName: string;
  hint?: string;
  category: MapType;
}

export const QUESTIONS: Record<MapScope, Question[]> = {
  world: [
    { id: "w1", text: "Locate South Africa", targetId: "ZAF", targetName: "South Africa", category: "political" },
    { id: "w2", text: "Locate South Korea", targetId: "KOR", targetName: "South Korea", category: "political" },
    { id: "w3", text: "Locate Brazil", targetId: "BRA", targetName: "Brazil", category: "political" },
    { id: "w4", text: "Locate Russia", targetId: "RUS", targetName: "Russia", category: "political" },
    { id: "w5", text: "Locate Australia", targetId: "AUS", targetName: "Australia", category: "political" },
    { id: "w6", text: "Locate Egypt", targetId: "EGY", targetName: "Egypt", category: "political" },
    { id: "w7", text: "Locate Kazakhstan", targetId: "KAZ", targetName: "Kazakhstan", category: "political" },
    { id: "w8", text: "Locate Argentina", targetId: "ARG", targetName: "Argentina", category: "political" },
    { id: "w9", text: "Locate Indonesia", targetId: "IDN", targetName: "Indonesia", category: "political" },
    { id: "w10", text: "Locate Saudi Arabia", targetId: "SAU", targetName: "Saudi Arabia", category: "political" },
    // Physical
    { id: "wp1", text: "Locate the region of the Andes Mountains", targetId: "CHL", targetName: "Chile", category: "physical", hint: "Longest continental mountain range" },
    { id: "wp2", text: "Locate the Sahara Desert region", targetId: "DZA", targetName: "Algeria", category: "physical", hint: "Largest hot desert" },
    { id: "wp3", text: "Locate the Amazon Rainforest region", targetId: "BRA", targetName: "Brazil", category: "physical", hint: "Largest tropical rainforest" },
    { id: "wp4", text: "Locate the Himalayas region", targetId: "NPL", targetName: "Nepal", category: "physical", hint: "Highest mountain range" },
    // Climatic
    { id: "wc1", text: "Locate a Tropical Rainforest climate zone", targetId: "IDN", targetName: "Indonesia", category: "climatic" },
    { id: "wc2", text: "Locate an Arid/Desert climate zone", targetId: "SAU", targetName: "Saudi Arabia", category: "climatic" },
    // Capitals
    { id: "wcap1", text: "Locate Pretoria (Administrative Capital of South Africa)", targetId: "ZAF", targetName: "South Africa", category: "capitals" },
    { id: "wcap2", text: "Locate Seoul (Capital of South Korea)", targetId: "KOR", targetName: "South Korea", category: "capitals" },
    { id: "wcap3", text: "Locate Brasilia (Capital of Brazil)", targetId: "BRA", targetName: "Brazil", category: "capitals" },
    { id: "wcap4", text: "Locate Moscow (Capital of Russia)", targetId: "RUS", targetName: "Russia", category: "capitals" },
    { id: "wcap5", text: "Locate Canberra (Capital of Australia)", targetId: "AUS", targetName: "Australia", category: "capitals" },
    { id: "wcap6", text: "Locate Cairo (Capital of Egypt)", targetId: "EGY", targetName: "Egypt", category: "capitals" },
    { id: "wcap7", text: "Locate Astana (Capital of Kazakhstan)", targetId: "KAZ", targetName: "Kazakhstan", category: "capitals" },
    { id: "wcap8", text: "Locate Buenos Aires (Capital of Argentina)", targetId: "ARG", targetName: "Argentina", category: "capitals" },
    { id: "wcap9", text: "Locate Jakarta (Capital of Indonesia)", targetId: "IDN", targetName: "Indonesia", category: "capitals" },
    { id: "wcap10", text: "Locate Riyadh (Capital of Saudi Arabia)", targetId: "SAU", targetName: "Saudi Arabia", category: "capitals" },
  ],
  asia: [],
  africa: [],
  europe: [],
  "north-america": [],
  "south-america": [],
  oceania: [],
  india: [
    { id: "i1", text: "Locate Odisha", targetId: "Orissa", targetName: "Odisha", category: "political" },
    { id: "i2", text: "Locate Maharashtra", targetId: "Maharashtra", targetName: "Maharashtra", category: "political" },
    { id: "i3", text: "Locate Tamil Nadu", targetId: "Tamil Nadu", targetName: "Tamil Nadu", category: "political" },
    { id: "i4", text: "Locate Rajasthan", targetId: "Rajasthan", targetName: "Rajasthan", category: "political" },
    { id: "i5", text: "Locate Gujarat", targetId: "Gujarat", targetName: "Gujarat", category: "political" },
    { id: "i6", text: "Locate Uttar Pradesh", targetId: "Uttar Pradesh", targetName: "Uttar Pradesh", category: "political" },
    { id: "i7", text: "Locate Kerala", targetId: "Kerala", targetName: "Kerala", category: "political" },
    { id: "i8", text: "Locate Assam", targetId: "Assam", targetName: "Assam", category: "political" },
    { id: "i9", text: "Locate Jammu & Kashmir", targetId: "Jammu and Kashmir", targetName: "Jammu & Kashmir", category: "political" },
    { id: "i10", text: "Locate West Bengal", targetId: "West Bengal", targetName: "West Bengal", category: "political" },
    // Physical
    { id: "ip1", text: "Locate the Thar Desert region", targetId: "Rajasthan", targetName: "Rajasthan", category: "physical" },
    { id: "ip2", text: "Locate the Western Ghats region", targetId: "Kerala", targetName: "Kerala", category: "physical" },
    { id: "ip3", text: "Locate the Deccan Plateau region", targetId: "Maharashtra", targetName: "Maharashtra", category: "physical" },
    { id: "ip4", text: "Locate the Northern Plains", targetId: "Uttar Pradesh", targetName: "Uttar Pradesh", category: "physical" },
    // Climatic
    { id: "ic1", text: "Locate the Tropical Wet region", targetId: "Kerala", targetName: "Kerala", category: "climatic" },
    { id: "ic2", text: "Locate the Semi-Arid region", targetId: "Gujarat", targetName: "Gujarat", category: "climatic" },
    // Capitals
    { id: "icap1", text: "Locate Bhubaneswar (Capital of Odisha)", targetId: "Orissa", targetName: "Odisha", category: "capitals" },
    { id: "icap2", text: "Locate Mumbai (Capital of Maharashtra)", targetId: "Maharashtra", targetName: "Maharashtra", category: "capitals" },
    { id: "icap3", text: "Locate Chennai (Capital of Tamil Nadu)", targetId: "Tamil Nadu", targetName: "Tamil Nadu", category: "capitals" },
    { id: "icap4", text: "Locate Jaipur (Capital of Rajasthan)", targetId: "Rajasthan", targetName: "Rajasthan", category: "capitals" },
    { id: "icap5", text: "Locate Gandhinagar (Capital of Gujarat)", targetId: "Gujarat", targetName: "Gujarat", category: "capitals" },
    { id: "icap6", text: "Locate Lucknow (Capital of Uttar Pradesh)", targetId: "Uttar Pradesh", targetName: "Uttar Pradesh", category: "capitals" },
    { id: "icap7", text: "Locate Thiruvananthapuram (Capital of Kerala)", targetId: "Kerala", targetName: "Kerala", category: "capitals" },
    { id: "icap8", text: "Locate Dispur (Capital of Assam)", targetId: "Assam", targetName: "Assam", category: "capitals" },
    { id: "icap9", text: "Locate Srinagar (Summer Capital of Jammu & Kashmir)", targetId: "Jammu and Kashmir", targetName: "Jammu & Kashmir", category: "capitals" },
    { id: "icap10", text: "Locate Kolkata (Capital of West Bengal)", targetId: "West Bengal", targetName: "Kolkata", category: "capitals" },
    // Rivers
    { id: "ir1", text: "Locate the Ganges River", targetId: "Ganges", targetName: "Ganges", category: "rivers" },
    { id: "ir2", text: "Locate the Brahmaputra River", targetId: "Brahmaputra", targetName: "Brahmaputra", category: "rivers" },
    { id: "ir3", text: "Locate the Indus River", targetId: "Indus", targetName: "Indus", category: "rivers" },
    { id: "ir4", text: "Locate the Yamuna River", targetId: "Yamuna", targetName: "Yamuna", category: "rivers" },
    { id: "ir5", text: "Locate the Narmada River", targetId: "Narmada", targetName: "Narmada", category: "rivers" },
    { id: "ir6", text: "Locate the Godavari River", targetId: "Godavari", targetName: "Godavari", category: "rivers" },
    { id: "ir7", text: "Locate the Krishna River", targetId: "Krishna", targetName: "Krishna", category: "rivers" },
    { id: "ir8", text: "Locate the Kaveri River", targetId: "Cauvery", targetName: "Kaveri", category: "rivers" },
    { id: "ir9", text: "Locate the Mahanadi River", targetId: "Mahanadi", targetName: "Mahanadi", category: "rivers" },
    { id: "ir10", text: "Locate the Tapti River", targetId: "Tapi", targetName: "Tapti", category: "rivers" },
    { id: "ir11", text: "Locate the Sabarmati River", targetId: "Sabarmati", targetName: "Sabarmati", category: "rivers" },
    { id: "ir12", text: "Locate the Mahi River", targetId: "Mahi", targetName: "Mahi", category: "rivers" },
    { id: "ir13", text: "Locate the Luni River", targetId: "Luni", targetName: "Luni", category: "rivers" },
    { id: "ir14", text: "Locate the Chambal River", targetId: "Chambal", targetName: "Chambal", category: "rivers" },
    { id: "ir15", text: "Locate the Betwa River", targetId: "Betwa", targetName: "Betwa", category: "rivers" },
    { id: "ir16", text: "Locate the Son River", targetId: "Son", targetName: "Son", category: "rivers" },
    { id: "ir17", text: "Locate the Gomti River", targetId: "Gomti", targetName: "Gomti", category: "rivers" },
    { id: "ir18", text: "Locate the Gandak River", targetId: "Gandak", targetName: "Gandak", category: "rivers" },
    { id: "ir19", text: "Locate the Kosi River", targetId: "Kosi", targetName: "Kosi", category: "rivers" },
    { id: "ir20", text: "Locate the Teesta River", targetId: "Teesta", targetName: "Teesta", category: "rivers" },
    { id: "ir21", text: "Locate the Subarnarekha River", targetId: "Subarnarekha", targetName: "Subarnarekha", category: "rivers" },
    { id: "ir22", text: "Locate the Damodar River", targetId: "Damodar", targetName: "Damodar", category: "rivers" },
    { id: "ir23", text: "Locate the Sharavati River", targetId: "Sharavati", targetName: "Sharavati", category: "rivers" },
    { id: "ir24", text: "Locate the Periyar River", targetId: "Periyar", targetName: "Periyar", category: "rivers" },
    { id: "ir25", text: "Locate the Tungabhadra River", targetId: "Tungabhadra", targetName: "Tungabhadra", category: "rivers" },
    { id: "ir26", text: "Locate the Bhima River", targetId: "Bhima", targetName: "Bhima", category: "rivers" },
    { id: "ir27", text: "Locate the Indravati River", targetId: "Indravati", targetName: "Indravati", category: "rivers" },
    { id: "ir28", text: "Locate the Wardha River", targetId: "Wardha", targetName: "Wardha", category: "rivers" },
    { id: "ir29", text: "Locate the Wainganga River", targetId: "Wainganga", targetName: "Wainganga", category: "rivers" },
    { id: "ir30", text: "Locate the Penganga River", targetId: "Penganga", targetName: "Penganga", category: "rivers" },
    // Lakes
    { id: "il1", text: "Locate Chilika Lake", targetId: "Chilka Lake", targetName: "Chilika Lake", category: "rivers" },
    { id: "il2", text: "Locate Wular Lake", targetId: "Wular Lake", targetName: "Wular Lake", category: "rivers" },
    { id: "il3", text: "Locate Vembanad Lake", targetId: "Vembanad Lake", targetName: "Vembanad Lake", category: "rivers" },
    { id: "il4", text: "Locate Sambhar Lake", targetId: "Sambhar Lake", targetName: "Sambhar Lake", category: "rivers" },
    { id: "il5", text: "Locate Loktak Lake", targetId: "Loktak Lake", targetName: "Loktak Lake", category: "rivers" },
    { id: "il6", text: "Locate Pulicat Lake", targetId: "Pulicat Lake", targetName: "Pulicat Lake", category: "rivers" },
    { id: "il7", text: "Locate Kolleru Lake", targetId: "Kolleru Lake", targetName: "Kolleru Lake", category: "rivers" },
    { id: "il8", text: "Locate Lonar Lake", targetId: "Lonar Lake", targetName: "Lonar Lake", category: "rivers" },
    { id: "il9", text: "Locate Pangong Tso", targetId: "Pangong Tso", targetName: "Pangong Tso", category: "rivers" },
    { id: "il10", text: "Locate Dal Lake", targetId: "Dal Lake", targetName: "Dal Lake", category: "rivers" },
    { id: "il11", text: "Locate Pushkar Lake", targetId: "Pushkar Lake", targetName: "Pushkar Lake", category: "rivers" },
    { id: "il12", text: "Locate Nakki Lake", targetId: "Nakki Lake", targetName: "Nakki Lake", category: "rivers" },
  ],
  odisha: [
    { id: "o1", text: "Locate Khordha (Capital District)", targetId: "20", targetName: "Khordha", category: "political" },
    { id: "o2", text: "Locate Cuttack", targetId: "12", targetName: "Cuttack", category: "political" },
    { id: "o3", text: "Locate Puri", targetId: "24", targetName: "Puri", category: "political" },
    { id: "o4", text: "Locate Ganjam", targetId: "16", targetName: "Ganjam", category: "political" },
    { id: "o5", text: "Locate Mayurbhanj", targetId: "22", targetName: "Mayurbhanj", category: "political" },
    { id: "o6", text: "Locate Sambalpur", targetId: "26", targetName: "Sambalpur", category: "political" },
    { id: "o7", text: "Locate Koraput", targetId: "21", targetName: "Koraput", category: "political" },
    { id: "o8", text: "Locate Balasore", targetId: "04", targetName: "Baleshwar", category: "political" },
    { id: "o9", text: "Locate Sundargarh", targetId: "29", targetName: "Sundargarh", category: "political" },
    { id: "o10", text: "Locate Kalahandi", targetId: "17", targetName: "Kalahandi", category: "political" },
    // Physical
    { id: "op1", text: "Locate the Coastal Plains (Puri)", targetId: "24", targetName: "Puri", category: "physical" },
    { id: "op2", text: "Locate the Northern Plateau (Mayurbhanj)", targetId: "22", targetName: "Mayurbhanj", category: "physical" },
    { id: "op3", text: "Locate the Central Tableland (Sambalpur)", targetId: "26", targetName: "Sambalpur", category: "physical" },
    // Capitals (Headquarters)
    { id: "ocap1", text: "Locate Bhubaneswar (HQ of Khordha)", targetId: "20", targetName: "Khordha", category: "capitals" },
    { id: "ocap2", text: "Locate Chhatrapur (HQ of Ganjam)", targetId: "16", targetName: "Ganjam", category: "capitals" },
    { id: "ocap3", text: "Locate Baripada (HQ of Mayurbhanj)", targetId: "22", targetName: "Mayurbhanj", category: "capitals" },
    { id: "ocap4", text: "Locate Bhawanipatna (HQ of Kalahandi)", targetId: "17", targetName: "Kalahandi", category: "capitals" },
  ]
};
