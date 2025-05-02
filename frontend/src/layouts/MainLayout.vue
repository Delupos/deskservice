<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <q-btn-dropdown v-if="verOrBtn" label="Menu">
          
          <q-list>
   
            <q-item v-if="accessToAllUser" :clickable="accessToAllUser" v-close-popup @click="showUserDialog()" id="itemToAllUser">
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


    <q-dialog v-model="displayAllUser" transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 500px; min-height: fit-content; max-height: 600px ; padding: 16px;">
        <q-table
          title="Alle Nutzer:"
          :rows="userData"
          :columns="columns"
          row-key="email"
        />
      </q-card>
  </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const title = ref("Desk-Service")
    const version = ref("1.0")
    const verOrBtn = ref(false)
    const router = useRouter()
    const token = ref("")
    const accessToAllUser = ref(false)
    const displayAllUser = ref(false)
    const columns = [
      {
        name: 'email',
        required: true,
        label: 'E-Mail',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
      },
      { name: 'vorname', align: 'center', label:'Vorname', field: 'vorname',  sortable: true },
      { name: 'nachname', label: 'Nachname', field: 'nachname',  sortable: true },
    ]
    const userData = ref([])

    onMounted(async() => {
      versionOrButton(router.currentRoute.value.fullPath)
      grantAccessToAllUser()
      await loadAllUserData()
    })

    watch(() => router.currentRoute.value.fullPath, (newPath) => {  
      versionOrButton(newPath)
      grantAccessToAllUser()
    })

    function grantAccessToAllUser(){
      if(router.currentRoute.value.fullPath != '/loginpage') {
        token.value = JSON.parse(atob(localStorage.getItem("accesstoken").split(".")[1]))
        accessToAllUser.value = token.value.isAdmin
      }     
    }

    const versionOrButton = (path) => {
      if (path != "/loginpage"){
        verOrBtn.value = true
      } else {
        verOrBtn.value = false
      }
    }

    async function showUserDialog() {
      displayAllUser.value = true
    }

    async function loadAllUserData() {
      try {
        const result = (await api.get('/api/getAllUser')).data.data
        for (let i = 0; i<result.length; i+=1){
          userData.value.push(
            {
              name: result[i].email,
              vorname: result[i].name,
              nachname: result[i].surname
            }
          )
        }
        // console.log(userData.value)
      } catch(err) {
        console.log(err)
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
      accessToAllUser,
      displayAllUser,
      columns,
      userData,
      logout,
      showUserDialog,
    }

  }
})
</script>

<style scoped>

</style>