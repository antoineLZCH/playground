<template>
  <client-only>
    <Vue3Marquee :gradient="true" :clone="true" :duration="15">
      <img class="logo" v-for="logo in logos" :key="logo.name" :src="logo.url" :alt="logo.name" width="200">
    </Vue3Marquee>
  </client-only>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import {Logo} from "~/models/logo.model";

defineProps<{
  logos: Logo[],
}>()

</script>

<style scoped>
.logo {
  margin: 0 16px;
  filter: grayscale(1);
  transition: filter .2s ease;
}

.logo:hover {
  filter: grayscale(0);
}
</style>
