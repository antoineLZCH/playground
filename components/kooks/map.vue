<template>
  <client-only>
    <div class="location-map" style="height: calc(100vh - 16px)" v-if="!locationsLoading">
      <l-map ref="map"
             :min-zoom="leafletOptions.minZoom"
             :max-zoom="leafletOptions.maxZoom"
             :zoom-animation="true"
             :zoom="leafletOptions.zoom"
             :center="leafletOptions.center"
             :useGlobalLeaflet="true"
             :options="{ tap: false }"
             @ready="onLeafletReady">
        <template v-if="leafletReady">
          <l-tile-layer :url="leafletOptions.url"/>
        </template>
      </l-map>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import * as L from 'leaflet';
import {LMap, LMarker, LTileLayer, LIcon} from "@vue-leaflet/vue-leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import {MarkerClusterGroup} from 'leaflet.markercluster'
import {isClient} from "@vueuse/shared";

const leafletOptions = ref({
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  minZoom: 5,
  maxZoom: 20,
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
  const response: any = await $fetch(url);

  if (response) {
    locations.value = response?.data;
    locationsLoading.value = false;
  }
};

const createMarkers = async () => {
  const markerCluster = new MarkerClusterGroup();

  let markers: any[] = [];

  for (let i = 0; i < 70; i++) {
    const options = { title: locations.value[i].name, clickable: true, draggable: false }
    const marker = L.marker([locations.value[i].lat, locations.value[i].long], options);

    if (locations.value[i].active) {
      markers.push(marker);
    }
    markerCluster.addLayers(markers);
  }

  map.value.leafletObject.addLayer(markerCluster);
}

onMounted(async () => {
  await getLocations();
})

watch(leafletReady, async () => {
  if (isClient) {
    await createMarkers();
  }
})
</script>
