import { geoCentroid } from 'd3-geo';
import * as topojson from 'topojson-client';

import { geoMercator } from 'd3-geo';

async function test() {
  const proj = geoMercator().scale(1000).center([80, 22]);
  const coords = proj([-101.59, -11.01]);
  console.log('Projected coords:', coords);
}
test();
