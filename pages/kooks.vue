<template>
  <div class="playground">
    <client-only>
      <Map/>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import {Logo} from "~/models/logo.model";
import Map from "~/components/kooks/map.vue";

const logos: Logo[] = [
  {
    name: 'Monoprix',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Monoprix_logo.svg/1280px-Monoprix_logo.svg.png'
  },
  {
    name: 'Leclerc',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/E.Leclerc_logo.svg/2560px-E.Leclerc_logo.svg.png'
  },
  {
    name: 'Gorillas',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Logo_Gorillas_%28delivery_company%29_color.svg/1200px-Logo_Gorillas_%28delivery_company%29_color.svg.png'
  }
]
</script>

<style>
.playground {
  height: 500px;
  //padding: 300px 0;
}

.marquee-wrapper {
  height: 72px;
  overflow: scroll;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
</style>

