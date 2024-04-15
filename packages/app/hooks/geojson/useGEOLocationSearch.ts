import { useMemo } from 'react';
import { createParam } from '@packrat/crosspath';

interface GeoSearchParams {
  osmId?: string;
  osmType?: string;
  name?: string;
}

const { useParams } = createParam<GeoSearchParams>();

export const useGEOLocationSearch = (): [
  GeoSearchParams,
  (geoJSON: any) => void,
] => {
  const { params: osm, setParams } = useParams();

  const setGEOLocation = (geoJSON) => {
    const newSearchParams: GeoSearchParams = {};

    if (
      geoJSON?.properties?.osm_id &&
      geoJSON.properties.osm_type &&
      geoJSON.properties.name
    ) {
      newSearchParams.osmId = geoJSON.properties.osm_id;
      newSearchParams.osmType = geoJSON.properties.osm_type;
      newSearchParams.name = geoJSON.properties.name;
    }

    setParams(newSearchParams);
  };

  return [osm, setGEOLocation];
};
