<script setup lang="ts">
import ModalEmission from "@/components/ModalEmission.vue";
import BeginEmission from "@/components/BeginEmission.vue";
import HomePlaylist from "@/components/HomePlaylist.vue";
import EmissionPlaylist from "@/components/EmissionPlaylist.vue";
</script>

<template>
  <div class="bg-thirdColor text-secondaryColor">
    <BeginEmission />
    <ModalEmission />
    <HomePlaylist />
    <EmissionPlaylist />
  </div>
</template>
