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
                <q-item-label>Tisch anlegen</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="accessToAllUser" :clickable="accessToAllUser" v-close-popup @click="displayDeleteTable = true" id="itemToAllUser">
              <q-item-section>
                <q-item-label>Tisch löschen</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="accessToAllUser" :clickable="accessToAllUser" v-close-popup @click="openUpload = true" id="itemToAllUser">
              <q-item-section>
                <q-item-label>Belegungsplan hochladen</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="accessToAllUser" :clickable="accessToAllUser" v-close-popup @click="showDeletePlan()" id="itemToAllUser">
              <q-item-section>
                <q-item-label>Belegungsplan löschen</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="logout()">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="showImpressum = true">
              <q-item-section>
                <q-item-label>Impressum</q-item-label>
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
    <q-card style="width: 100vw; max-width: 800px; max-height: 90vh; padding: 16px;">
      <div style="overflow-x: auto;">
        <q-table
          dense
          flat
          bordered
          title="Alle Nutzer:"
          :rows="userData"
          :columns="columns"
          row-key="email"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                style="background-color: #D9DBF1;"
                label="Ändern"
                @click="blockUnblockUser(props.row)"
                size="sm"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-delete="props">
            <q-td :props="props">
              <q-btn
                color="negative"
                label="Löschen"
                @click="deleteUser(props.row)"
                size="sm"
                outline
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="displayCreateTable" transition-show="scale" transition-hide="scale">
    <q-card style="min-width: 350px; min-height: fit-content; max-height: 600px ; padding: 16px; max-width: 500px; width: 100%;">
      <q-card-section style="min-height: 100px; max-height: 100px; margin-top: -30px; margin-bottom: 20px;">          
        <h6>Lege einen neuen Tisch an:</h6>  
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled dense v-model="createNewTable.seatId" autofocus label='*Tischnummer:'></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled dense v-model="createNewTable.place" autofocus label='*Stadt von Standort:'></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled dense v-model="createNewTable.street" autofocus label='Straße (Optional):'></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <a style="margin-left: 4px;">Handelt es sich um ein Meetingraum: </a> <q-checkbox v-model="createNewTable.meetingRoom"></q-checkbox>
      </q-card-section>
      <q-card-section class="q-pt-none" v-if=createNewTable.meetingRoom>
        <q-input
          v-model="createNewTable.seats"
          type="number"
          min="1"
          label="Anzahl Sitze"
        />
      </q-card-section>
      <q-card-actions style="display: flex; justify-content: space-between;">
          <q-btn flat label='Schließen' v-close-popup no-caps></q-btn>
          <q-btn flat label='Erstellen' v-close-popup no-caps @click="createTable()"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="displayDeleteTable" transition-show="scale" transition-hide="scale">
    <q-card style="width: 100vw; max-width: 800px; max-height: 90vh; padding: 16px;">
      <q-table
            dense
            flat
            bordered
            title="Alle Tische:"
            :rows="tableData"
            :columns="columns_tables"
            row-key="email"
          >
          <template v-slot:body-cell-delete="props">
              <q-td :props="props">
                <q-btn
                  color="negative"
                  label="Löschen"
                  @click="deleteTable(props.row)"
                  size="sm"
                  outline
                />
              </q-td>
            </template>
        </q-table>
    </q-card>
  </q-dialog>

  <q-dialog v-model="openUpload" backdrop-filter="blur(10px)">
    <q-card class="flex-col">
      <q-bar>
        Anhang hochladen
        <q-space/>
        <q-btn flat dense icon="close" @click="openUpload = false" />
      </q-bar>

      <q-card-section>
        <q-input label="Standort" v-model="placeforImage"></q-input>
      </q-card-section>

      <q-card-section>
        <q-file outlined bottom-slots v-model="uploadImage" label="Bild auswählen..." counter max-files="1" accept=".jpg, image/*" @update:model-value="handleImg">
          <template v-slot:before>
            <q-icon name="attachment" />
          </template>

          <template v-slot:append>
            <q-icon v-if="uploadImage !== null" name="close" @click.stop.prevent="() => {uploadImage = null; showImageTest = null}" class="cursor-pointer" />
          </template>

          <template v-slot:hint>
            Eine Bilddatei
          </template>
        </q-file>
      </q-card-section>

      <q-separator style=""/>

      <q-card-section style="position: relative; min-height: 120px; display: flex; align-items: center; flex-direction: column;">
        <div class="img-preview">
          <img v-if="showImageTest" width="100%" :src="showImageTest" alt="">
          <p v-else>Vorschau für den neuen Anhang</p>
          <q-btn rounded :loading="appendixButtonSuccess" icon="add" :disabled="uploadImage === null" :class="{'bg-primary': uploadImage !== null}" @click="addNewAppendix">
            Hochladen
            <template v-slot:loading>
              <q-spinner v-if="!uploadImageFailed"/>
              <q-icon v-else name="close" />
            </template>
          </q-btn>
        </div>

      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="displayDeletePlan">
    <q-card
      v-if="appendixLoaded"
      style="min-width: 50%; max-height: 90vh; padding: 16px; overflow: auto;"
    >
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="img in computedAppendix" :key="img">
          <div style="display: flex; justify-content: space-between;">
            <h5 style="margin: 0px 0 8px 0;">Standort: {{ img.place ? img.place : "Keine Angabe" }}</h5>
            <q-btn label="Löschen" style="max-height: 30px; background-color: rgba(242, 80, 80, 0.65); margin-bottom: 12px;" @click="deletePlan(img)"></q-btn>
          </div>
          <img
            :src="img.image"
            alt="Appendix image"
            style="object-fit: contain; max-width: 100%; max-height: 600px;"
          />
        </div>

        <h3 v-if="computedAppendix.length < 1">Keine Einträge gefunden</h3>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showImpressum" transition-show="scale" transition-hide="scale">
    <q-card style="min-width: 320px; max-height: 1000px; max-width: 500px; width: 100%;">
      <q-card-section style="min-height: 100px; max-height: 100px; margin-top: -30px; margin-bottom: 20px;">
        <h4 style="font-weight: bold;">Impressum:</h4>
      </q-card-section>

      <q-card-section>
        <p>Timm Kalesse</p>
        <p>Muster Straße</p>
        <p>12345 Musterhausen</p>
        <h6 style="margin-top: 25px; margin-bottom: 20px;">Kontakt:</h6>
        <p>Telefon: 0123 12345678</p>
        <p>E-Mail: timm-kalesse@mustermail.de</p>
      </q-card-section>

      <q-card-actions style="display: flex; justify-content: right;">
        <q-btn flat label='Schließen' v-close-popup></q-btn>
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
    const displayCreatePlan = ref(false)
    const displayDeletePlan = ref(false)
    const displayDeleteTable = ref(false)
    const createNewTable = ref({
      seatId: "",
      place: "",
      street: "",
      meetingRoom: false,
      seats: null
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
      { name: 'blocked', label: 'Blockiert', field: 'blocked', sortable: true, format: val => val ? 'Ja' : 'Nein'},
      { name: 'actions', label: 'Blockieren/ Freigeben', field: 'actions', align: 'right' },
      { name: 'delete', label: 'Löschen', field: 'delete', align: 'right'}
    ]
    const columns_tables = [
      { name: 'id', align: 'left', required: true, label: 'Id', field: 'id', sortable: true },
      { name: 'seatId', align: 'center', label:'Seat Id', field: 'seatId',  sortable: true },
      { name: 'place', align: 'center', label:'Ort', field: 'place',  sortable: true },
      { name: 'street', align: 'center', label:'Straße', field: 'street',  sortable: true, format: val => val ? val : 'Keine Angabe' },
      { name: 'meetingRoom', label: 'Meeting Raum', field: 'meetingRoom', sortable: true, format: val => val ? 'Ja' : 'Nein'},
      { name: 'seats', label: 'Plätze', field: 'seats', sortable: true, format: val => val ? val : '1'},
      { name: 'delete', label: 'Löschen', field: 'delete', align: 'right'}
    ]
    const userData = ref([])
    const tableData = ref([])
    const openUpload = ref(false)
    const uploadImage = ref(null);
    const showImageTest = ref(null);
    const uploadImageFailed = ref(false);
    const appendixButtonSuccess = ref(false);
    const appendixLoaded = ref(false);
    const placeforImage = ref("")
    const computedAppendix = ref(null)
    const showImpressum = ref(false)


    onMounted(async() => {
      versionOrButton(router.currentRoute.value.fullPath)
      grantAccessToAllUser()
      loadImages()
      appendixLoaded.value = true
      await loadAllUserData()
      await openDeleteTableWindow()
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
      // await loadAllUserData()
      displayAllUser.value = true
    }

    async function showTableDialog() {
      displayCreateTable.value = true
    }

    async function showDeletePlan() {
      displayDeletePlan.value = true
    }

    async function createTable() {
      try {

        if(createNewTable.value.place == "" || createNewTable.value.seatId == "") {
          return $q.notify({
            message: "Bitte die notwendigen Daten angeben.",
            type: "negative",
            timeout:2000
          })
        }

        if(createNewTable.value.seats == null && createNewTable.value.meetingRoom == true) {
          return $q.notify({
            message: "Bitte die Anzahl der Sitze angeben.",
            type: "negative",
            timeout:2000
          })
        }
        api.post('/api/createTable', createNewTable.value, {headers: {"authorization": localStorage.getItem('accesstoken')}})
        createNewTable.value = {
          seatId: "",
          place: "",
          street: "",
          meetingRoom: false,
          seats: null
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
              blocked: result[i].blocked,
              id: result[i].id
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

    async function handleImg(fileData) {
      const reader = new FileReader();
      reader.onload = () => {
        const byteArray = new Uint8Array(reader.result);
        let img = arrayData(byteArray);
        showImageTest.value = "data:image/png;base64," + img;
        // console.log(showImageTest.value)
      }
      reader.readAsArrayBuffer(fileData);
    }

    function arrayData(arr) {
      let chars = "";
      for (const byte of arr) {
        chars+=String.fromCharCode(byte);
      }
      return btoa(chars); // base64 String
    }

    async function addNewAppendix() {
      appendixButtonSuccess.value = true;
      // console.log(showImageTest.value.split(",")[1])
      if (await api.post('/api/appendix', {image: showImageTest.value.split(",")[1], place: placeforImage.value})) {
          openUpload.value = false;
          placeforImage.value = ""
          showImageTest.value = null;
          uploadImage.value = null;
          appendixButtonSuccess.value = false;
          $q.notify({
            message: "Bild wurde erfolgreich hochgeladen.",
            type: "positive",
            timeout: 2000
          })
          loadImages()
          try {
            // failtimeout.close()
          } catch (err) {
            console.log(err)
          }
          return;
      } else {
        uploadImageFailed.value = true;
        try {
          // failtimeout.close()
        } catch (err) {console.log(err)}
      }

      $q.notify({
        message: "Fehler beim hochladen des Anhangs.",
        type: "negative",
        timeout: 2000
      })
      setTimeout(() => {
        openUpload.value = false;
        showImageTest.value = null;
        uploadImage.value = null;
        appendixButtonSuccess.value = false;
        uploadImageFailed.value = false;
      }, 1000);

    }
    
    async function loadImages() {
      computedAppendix.value = await (await api.get("/api/appendix")).data.data
    }

    async function deletePlan(plan) {
      try {
        await api.delete('/api/appendix?id=' + plan.id)
        $q.notify({
          message: "Erfolgreich gelöscht",
          type: 'positive',
          timeout: 2000
        })
        loadImages()
      } catch(err) {
        console.log(err)
        $q.notify({
          message: "Fehler beim löschen",
          type: 'negative',
          timeout: 2000
        })
      }
      displayDeletePlan.value = false
    }

    async function deleteUser(user) {
      $q.dialog({
        title: 'Nutzer löschen',
        message: `Möchtest du den Nutzer mit der E-Mail "${user.name}" wirklich löschen?`,
        ok: {
          label: 'Löschen',
          color: 'negative'
        },
        cancel: {
          label: 'Abbrechen',
          color: 'primary'
        },
        persistent: true
      }).onOk(async () => {
        try {
          await api.delete(`/api/deleteUser/?id=${user.id}`, {headers: {"authorization": localStorage.getItem('accesstoken')}})
          $q.notify({
            message: 'Nutzer wurde erfolgreich gelöscht',
            type: 'positive'
          })

          userData.value = []
          await loadAllUserData()

        } catch (err) {
          console.error(err)
          $q.notify({
            message: 'Fehler beim Löschen des Nutzers',
            type: 'negative'
          })
        }
      })
    }

    async function openDeleteTableWindow() {
      try {
        const result = (await api.get('/api/getAllTables', {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
        for (let i = 0; i<result.length; i+=1){
          tableData.value.push(
            {
              id: result[i].id,
              seatId: result[i].seatId,
              place: result[i].place,
              street: result[i].street,
              meetinRoom: result[i].meetinRoom,
              seats: result[i].seats
            }
          )
        }
      } catch(err) {
        console.log(err)
      }
    }

    async function deleteTable(table) {
      $q.dialog({
        title: 'Tisch Löschen',
        message: `Möchtest du den Tisch mit der Seat Id ${table.seatId} (Id: ${table.id}) wirklich löschen?`,
        ok: {
          label: 'Löschen',
          color: 'negative'
        },
        cancel: {
          label: 'Abbrechen',
          color: 'primary'
        },
        persistent: true
      }).onOk(async () => {
        try {
          await api.delete(`/api/deleteTable/?id=${table.id}`, {headers: {"authorization": localStorage.getItem('accesstoken')}})
          $q.notify({
            message: 'Tisch wurde erfolgreich gelöscht',
            type: 'positive'
          })

          tableData.value = []
          await openDeleteTableWindow()

        } catch (err) {
          console.error(err)
          $q.notify({
            message: 'Fehler beim Löschen des Nutzers',
            type: 'negative'
          })
        }
      })
    }

    return {
      title,
      version,
      verOrBtn,
      accessToAllUser,
      displayAllUser,
      displayCreatePlan,
      columns,
      userData,
      displayCreateTable,
      createNewTable,
      openUpload,
      uploadImage,
      showImageTest,
      uploadImageFailed,
      appendixButtonSuccess,
      appendixLoaded,
      placeforImage,
      displayDeletePlan,
      computedAppendix,
      showImpressum,
      displayDeleteTable,
      columns_tables,
      tableData,
      showDeletePlan,
      logout,
      showUserDialog,
      showTableDialog,
      createTable,
      blockUnblockUser,
      handleImg,
      deletePlan,
      addNewAppendix,
      deleteUser,
      openDeleteTableWindow,
      deleteTable,
    }

  }
})
</script>

<style scoped>
.create {
  position: absolute;
  right: 20px;
  bottom: 20px;
  margin-left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 20px;
}
</style>