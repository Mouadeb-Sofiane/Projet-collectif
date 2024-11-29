<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
</script>

<template>
  <Header />
    <Suspense>
      <RouterView/>
    </Suspense>
  <Footer />
</template>