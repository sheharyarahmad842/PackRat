import { z } from 'zod';

export const addTripForm = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  isPublic: z.union([z.literal('0'), z.literal('1')]),
});

// @ts-ignore
const coordinateSchema = z.lazy(() =>
  z.union([z.number(), z.array(coordinateSchema)]),
);

const baseGeometrySchema = z.object({
  type: z.string(),
  coordinates: coordinateSchema,
});

const geometryCollectionSchema = z.object({
  type: z.literal('GeometryCollection'),
  geometries: z.array(baseGeometrySchema),
});

const geometrySchema = z.union([baseGeometrySchema, geometryCollectionSchema]);

const featurePropertiesSchema = z.record(
  z.union([z.string(), z.number(), z.boolean()]),
);

const featureSchema = z.object({
  type: z.literal('Feature'),
  id: z.string(),
  properties: featurePropertiesSchema,
  geometry: geometrySchema,
});

export const getTrips = z.object({
  owner_id: z.string().optional(),
});

export const getTripById = z.object({
  tripId: z.string(),
});

export const addTrip = z.object({
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  weather: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  destination: z.string(),
  geoJSON: z.object({
    type: z.literal('FeatureCollection'),
    features: z.array(featureSchema),
  }),
  owner_id: z.string(),
  pack_id: z.string(),
  is_public: z.boolean(),
});

export const editTrip = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.string(),
  weather: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  destination: z.string(),
  is_public: z.boolean(),
});

export const deleteTrip = z.object({
  tripId: z.string().nonempty(),
});

export const queryTrip = z.object({
  queryBy: z.string(),
  tripId: z.string(),
});
