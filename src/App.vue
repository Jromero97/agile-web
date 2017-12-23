<template lang="pug">
  .container-fullwidth.text-center
    router-view
</template>

<script>
  // import Cursor from '@/assets/js/cursor';

  export default {
    name: 'app',
  };
</script>

<style>

  html,body {
    height: 100%;
    overflow: hidden;
  }
  .container-fullwidth {
    height: 100%;
  }

</style>
