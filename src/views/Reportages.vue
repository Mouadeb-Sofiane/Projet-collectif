<script setup lang="ts">
import ModalReportage from "@/components/ModalReportage.vue";
import BeginReportage from "@/components/BeginReportage.vue";
import HomePlaylist from "@/components/HomePlaylist.vue";
import ReportagesPlaylists from "@/components/ReportagesPlaylists.vue";
</script>

<template>
  <div class="bg-thirdColor text-secondaryColor">
    <BeginReportage />
    <ModalReportage />
    <HomePlaylist />
    <ReportagesPlaylists />
  </div>
</template>
