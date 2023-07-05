import Way from "../../models/osm/wayModel.js";
import Node from "../../models/osm/nodeModel.js";
import Relation from "../../models/osm/relationModel.js";

import {
  createInstanceFromCoordinates,
  handleGeometry,
  handleGeoJSONGeometry,
} from "./coordinateHandlers.js";
import {
  isOSMFormat,
  isGeoJSONFormat,
  propertiesToTags,
  extractIdAndType,
} from "./dataFormatters.js";

export async function fromOSM(Model, data) {
  const { type, id } = extractIdAndType(data.id);

  const instanceData = {
    osm_id: id,
    osm_type: type,
    tags: propertiesToTags(data.tags),
    updated_at: data.timestamp,
  };

  // Find or create nodes
  const ids = data.nodes.map((node) => node.id);
  const instances = await Node.findOrCreateMany(ids, data.nodes);

  // Add nodes to instance
  instanceData.nodes = instances.map((instance) => instance._id);

  // Create instance
  const newInstance = await Model.create(instanceData);

  return newInstance;
}

export async function fromGeoJSON(Model, geoJSON) {
  const instance = new Model();
  instance.tags = new Map();

  // Extract OSM ID and type from properties, if available
  if (geoJSON.id) {
    const { type, id } = extractIdAndType(geoJSON.id);
    instance.osm_type = type.toLowerCase(); // Standardize osm_type to be lowercase
    instance.osm_id = id;
  }

  // Convert properties to tags
  instance.tags = propertiesToTags(geoJSON.properties || {});

  //Set the GeoJSON representation
  instance.geoJSON = geoJSON;

  // Save and return the new instance
  await instance.save();
  return instance;
}

export async function toGeoJSON(Model, instance) {
  if (!instance) {
    console.error("instance is undefined or null");
    return {};
  }

  const geoJSON = {
    type: "Feature",
    geometry: instance.geoJSON.geometry, //Use the stored GeoJSON geometry
    properties: propertiesToTags(instance.tags),
  };

  return geoJSON;
}

// Mapping of types to Models
const modelMappingFunc = (type) => {
  switch (type) {
    case "node":
    case "n":
      return Node;
    case "way":
    case "w":
      return Way;
    case "relation":
    case "r":
      return Relation;
    default:
      return null;
  }
};

export function findExisting(Model, id, type) {
  return Model.findOne({ osm_id: id, osm_type: type });
}

export async function updateInstanceFromGeoJSON(instance, geoJSON) {
  instance.updated_at = geoJSON.properties.timestamp;
  instance.tags = propertiesToTags(geoJSON.properties);
  instance.geoJSON = geoJSON;
  return instance;
}

export function createNewInstance(Model, element) {
  if (isOSMFormat(element)) {
    return fromOSM(Model, element);
  } else if (isGeoJSONFormat(element)) {
    return fromGeoJSON(Model, element);
  }
  throw new Error("Element is neither in OSM or GeoJSON format.");
}

export function ensureIdProperty(element) {
  if (!element.id && element.properties && element.properties.osm_id) {
    let { osm_type, osm_id } = element.properties;

    if (osm_type === "N") {
      osm_type = "node";
    } else if (osm_type === "W") {
      osm_type = "way";
    } else if (osm_type === "R") {
      osm_type = "relation";
    }

    element.id = `${osm_type}/${osm_id}`;
  }

  if (!element.type && element.properties && element.properties.osm_type) {
    element.type = element.properties.osm_type;
  }

  return element;
}

export function ensureModelProperty(element) {
  const osmType =
    typeof element.properties.osm_type === "string"
      ? element.properties.osm_type.toLowerCase()
      : element.properties.osm_type;
  const ModelForElement = modelMappingFunc(osmType);
  if (!ModelForElement) {
    console.error(`Invalid type: ${element.properties.osm_type}`);
    return;
  }
  return ModelForElement;
}

export async function processElement(element) {
  const id = element.id
    ? Number(element.id.split("/")[1])
    : Number(element.properties.osm_id);
  const type = element.id
    ? element.id.split("/")[0]
    : element.properties.osm_type;

  const ModelForElement = modelMappingFunc(type);
  if (!ModelForElement) {
    console.error(`Invalid type: ${type}`);
    return;
  }

  let instance = await findExisting(ModelForElement, id, type);
  if (instance) {
    if (isGeoJSONFormat(element)) {
      instance = await updateInstanceFromGeoJSON(instance, element);
      await instance.save();
    }
  } else {
    instance = await createNewInstance(ModelForElement, element);
  }
  return instance;
}

export async function findOrCreateOne(Model = Way, element) {
  return processElement(element);
}

export async function findOrCreateMany(Model = Way, data) {
  if (!Array.isArray(data)) {
    throw new Error("Data is not iterable, cannot proceed.");
  }

  const instances = [];

  for (let element of data) {
    const instance = await processElement(element);
    if (instance) {
      instances.push(instance);
    }
  }
  return instances;
}
