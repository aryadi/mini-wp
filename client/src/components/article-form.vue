<template>
  <section id="content-section-add">
    <form @submit.prevent="formSubmit" enctype="multipart/form-data">
      <input type="text" v-model="articleObj.title" class="title" placeholder="Title">
      <wysiwyg v-model="articleObj.description"></wysiwyg>
      <div class="show-image-form" v-bind:style="{ backgroundImage: 'url(' + articleObj.image + ')' }"></div>
      <input class="input-image" type="file" name="image" accept="image/png, image/jpeg" @change="parseImage($event)">
      <button type="submit" class="btn btn-success button-form">Submit</button>
    </form>
  </section>
</template>

<script>
  export default {
    props: ['articleObj'],
    data() {
      return {
      }
    },
    methods: {
      formSubmit() {
        this.$emit('formSubmit');
      },
      parseImage($event) {
        this.$emit('parseImage', $event);
      }
    }
  }
</script>

<style>

</style>
