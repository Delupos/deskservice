<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <q-btn-dropdown v-if="verOrBtn" label="Menu">
          
          <q-list>
   
            <q-item clickable v-close-popup >
              <q-item-section>
                <q-item-label>Alle Nutzer anzeigen</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="logout()">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        
        </q-btn-dropdown>

        <div v-else>Version: {{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const title = ref("Desk-Service")
    const version = ref("1.0")
    const verOrBtn = ref(false)
    const router = useRouter()

    onMounted(() => {
      versionOrButton(router.currentRoute.value.fullPath)
    })

    watch(() => router.currentRoute.value.fullPath, (newPath) => {  
      versionOrButton(newPath)
    })

    const versionOrButton = (path) => {
      if (path != "/loginpage"){
        verOrBtn.value = true
      } else {
        verOrBtn.value = false
      }
    }

    function logout() {
      localStorage.clear()
      router.push('../login')
    }

    return {
      title,
      version,
      verOrBtn,
      logout
    }

  }
})
</script>
