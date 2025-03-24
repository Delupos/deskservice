<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <div>Version: {{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const title = ref("Desk-Service")
    const version = ref("1.0")

    return {
      title,
      version
    }

  }
})
</script>
