<template>
    <div class="text-center text-red-500">
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "ErrorDisplay",
    props: {
      message: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  