import { merge } from 'topojson-client';
import centroid from '@turf/centroid';

export default function getMergedData(topoJSON, mergeProperty, scenarios) {
    let topoData = JSON.parse(JSON.stringify(topoJSON));
    scenarios.forEach(scenario=> {
        let geometry = topoData.objects.munis_simple_nodata.geometries.find(geom => geom.properties.niscode == scenario.niscode)
        let index = topoData.objects.munis_simple_nodata.geometries.indexOf(geometry)
        topoData.objects.munis_simple_nodata.geometries[index].properties[mergeProperty] = scenario.to
    })
    let ids = [
        ...new Set(topoJSON.objects.munis_simple_nodata.geometries.map((d) => d.properties[mergeProperty]))
    ].filter((d) => d);
    return ids.map((d) => {
        let geoJson = merge(
            topoData,
            topoData.objects.munis_simple_nodata.geometries.filter((g) => g.properties[mergeProperty] == d)
        );
        geoJson.id = d;
        geoJson.centroid = geoJson.coordinates.length > 0 ? centroid(geoJson).geometry.coordinates : [0,0];
        return geoJson;
    });
}