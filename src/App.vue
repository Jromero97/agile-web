<template lang="pug">
  .container-fullwidth.text-center
    <home></home>
    router-view
</template>

<script>

  export default {
    name: 'app',
  };
</script>

<style>

  html,body {
    height: 100%;
    /*overflow: hidden;*/
  }
  .container-fullwidth {
    height: 100%;
  }



</style>
