<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #17354f;">

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

            <q-item v-if="accessToAllUser" :clickable="accessToAllUser" v-close-popup @click="showTableDialog()" id="itemToAllUser">
              <q-item-section>
                <q-item-label>Neuen Tisch anlegen</q-item-label>
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
      <q-card style="min-width: 800px; min-height: fit-content; max-height: 600px ; padding: 16px;">
        <q-table
          title="Alle Nutzer:"
          :rows="userData"
          :columns="columns"
          row-key="email"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn style="background-color: #D9DBF1;" label="Ändern" @click="blockUnblockUser(props.row)" size="sm" />
            </q-td>
          </template>
        </q-table>
      </q-card>
  </q-dialog>

  <q-dialog v-model="displayCreateTable" transition-show="scale" transition-hide="scale">
    <q-card style="min-width: 500px; min-height: fit-content; max-height: 600px ; padding: 16px;">
      <q-card-section style="min-height: 100px; max-height: 100px; margin-top: -30px; margin-bottom: 20px;">          
        <h6>Lege einen neuen Tisch an:</h6>  
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled dense v-model="createNewTable.seatId" autofocus label='Tischnummer:'></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled dense v-model="createNewTable.place" autofocus label='Stadt von Standort:'></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled dense v-model="createNewTable.street" autofocus label='Straße (Optional):'></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <a style="margin-left: 4px;">Handelt es sich um ein Meetingraum: </a> <q-checkbox v-model="createNewTable.meetingRoom"></q-checkbox>
      </q-card-section>
      <q-card-actions style="display: flex; justify-content: space-between;">
          <q-btn flat label='Schließen' v-close-popup no-caps></q-btn>
          <q-btn flat label='Erstellen' v-close-popup no-caps @click="createTable()"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const $q = useQuasar()
    const title = ref("SmartSeat")
    const version = ref("1.0")
    const verOrBtn = ref(false)
    const router = useRouter()
    const token = ref("")
    const accessToAllUser = ref(false)
    const displayAllUser = ref(false)
    const displayCreateTable = ref(false)
    const createNewTable = ref({
      seatId: "",
      place: "",
      street: "",
      meetingRoom: false
    })
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
      { name: 'blocked', label: 'Blockiert', field: 'blocked', sortable: true},
      { name: 'actions', label: 'Blockieren/ Freigeben', field: 'actions', align: 'right' }
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

    async function showTableDialog() {
      displayCreateTable.value = true
    }

    async function createTable() {
      try {
        api.post('/api/createTable', createNewTable.value, {headers: {"authorization": localStorage.getItem('accesstoken')}})
        createNewTable.value = {
          seatId: "",
          place: "",
          street: "",
          meetingRoom: false,
        }
        $q.notify({
            message: "Erfolgreich erstellt.",
            type: "positive",
            timeout:2000
        })
      } catch {
        $q.notify({
            message: "Fehler beim Erstellen.",
            type: "negative",
            timeout:2000
        })
      }
    }

    async function loadAllUserData() {
      try {
        const result = (await api.get('/api/getAllUser', {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
        for (let i = 0; i<result.length; i+=1){
          userData.value.push(
            {
              name: result[i].email,
              vorname: result[i].name,
              nachname: result[i].surname,
              blocked: result[i].blocked
            }
          )
        }
      } catch(err) {
        console.log(err)
      }
    }

    async function blockUnblockUser(user) {
      const data = ref({
        email: user.name,
        blocked: !user.blocked
      })
      await api.post('/api/blockUser', data.value)
      
      userData.value = []
      await loadAllUserData()

      $q.notify({
            message: "Status wurde geändert.",
            type: "positive",
            timeout:2000
        })      
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
      displayCreateTable,
      createNewTable,
      logout,
      showUserDialog,
      showTableDialog,
      createTable,
      blockUnblockUser,
    }

  }
})
</script>

<style scoped>

</style>