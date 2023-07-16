<template>
  <client-only>
    <div v-if="!locationsLoading" class="location-map" style="height: calc(100vh - 16px)">
      <l-map ref="map"
             :center="leafletOptions.center"
             :max-zoom="leafletOptions.maxZoom"
             :min-zoom="leafletOptions.minZoom"
             :options="{ tap: false }"
             :useGlobalLeaflet="true"
             :zoom="leafletOptions.zoom"
             :zoom-animation="true"
             @ready="onLeafletReady">
        <template v-if="leafletReady">
          <l-tile-layer :url="leafletOptions.url"/>
        </template>
      </l-map>
    </div>
  </client-only>
</template>
<script lang="ts" setup>
import * as L from 'leaflet';
import {LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {MarkerClusterGroup} from 'leaflet.markercluster'
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';

import {isClient} from "@vueuse/shared";
import locationsMock from '~/data/locations.json';

const leafletOptions = ref({
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  minZoom: 5,
  maxZoom: 15,
  zoom: 5.5,
  map: null,
  center: [47.040182, 2.536054],
  bounds: null,
  overlayLocation: false,
})

const leafletObject = ref()
const map = ref();
const locationsLoading = ref(false);
const locations = ref();
const leafletReady = ref(false);
const url = `https://strapi.kooks.eu/api/locations?populate=deep&pagination[page]=1&pagination[pageSize]=1000&filters[active][$eq]=true`

const onLeafletReady = async () => {
  await nextTick();
  leafletObject.value = map.value;
  leafletReady.value = true;
}

const getLocations = async (): Promise<void> => {
  locationsLoading.value = true;
  // const response: any = await $fetch(url);

  // if (response) {
  //   locations.value = response?.data;
  //   locationsLoading.value = false;
  // }

  locations.value = locationsMock.data;
  locationsLoading.value = false;
};

const checkCoordinates = (lat: number, lng: number): boolean => {
  const regex = /^-?([0-9]|[1-8][0-9]|90)(\.[0-9]+)?$/;

  const latString = lat.toString();
  const lngString = lng.toString();

  return regex.test(latString) && regex.test(lngString);
};

const createMarkers = async () => {
  const markerCluster = new MarkerClusterGroup();

  let markers: any[] = [];

  locations.value.forEach((location: any) => {
    const options = {title: location.nom, clickable: true, draggable: false}

    if (checkCoordinates(location.lat, location.long)) {

      const marker = L.marker([location.lat, location.long], options);

      markers.push(marker);
      markerCluster.addLayers(markers)
    }
  })

  map.value.leafletObject.addLayer(markerCluster);
}

const injectSearchBar = () => {
  const searchControl = new GeoSearchControl({
    notFoundMessage: "Nous n'arrivons pas à vous trouver ☹️",
    searchLabel: 'Chercher autour de chez moi',
    marker: {
      icon: new L.Icon.Default(),
      draggable: false
    },
    provider: new OpenStreetMapProvider(),
    style: 'bar',
    autoCompleteDelay: 300
  })

  map.value.leafletObject.addControl(searchControl);
}

onMounted(async () => {
  await getLocations();
})

watch(leafletReady, async () => {
  if (isClient) {
    await createMarkers();
    injectSearchBar();
  }
})
</script>

<style>
.leaflet-control.leaflet-control-geosearch.leaflet-geosearch-bar {
  display: none;
}

.leaflet-geosearch-bar {
  position: absolute;
  z-index: 1000;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.leaflet-geosearch-bar input {
  padding: 0.875rem 1rem;
  background-color: #FFF;
  border-radius: 30px;
  appearance: none;
  border: none;
  margin-right: 8px;
  width: 250px;
}

.leaflet-geosearch-bar .results {
  margin-top: 0.5rem;
  background-color: #FFF;
}
</style>
