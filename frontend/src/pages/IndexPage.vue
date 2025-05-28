<template>
  <q-page class="content">

    <div class="calender">
      <img src="/logo1.jpeg" style="width: 260px; margin-top: 100px; margin-bottom: 40px;">
      <div class="q-pa-md">
        <div class="q-gutter-md row items-start">
          <q-date v-model="attributesToBookTable.date" minimal style="background-color: #17354f; color: white;" />
        </div>
      </div>
      <h6 style="margin: 0px; margin-top: 20px;">Ihr ausgewähltes Datum:</h6>
      <h5 v-if="attributesToBookTable.date" style="margin: 0px;">{{ attributesToBookTable.date }}</h5>
      <h5 v-else style="margin: 0px">Bitte ein Datum auswählen</h5>
    </div>

    <div class="table">
      <div class="overline">
        <p class="overlinetext">
          <br>
          Raumübersicht
        </p>
        <div style="width: 100%; display: flex; justify-content: right; padding-right: 20px;">
          <q-btn label="Belegungsplan anzeigen" style="background-color: #17354f;color: white; border-radius: 16px; margin-bottom: 8px;" @click="showImage()"></q-btn>
        </div>
      </div>

      <div class="deskview">

        <div style="height: 50vh; display: flex; flex-direction: column;">
          <q-scroll-area style="flex-grow: 1; height: 100%;" :thumb-style="thumbStyle" :bar-style="barStyle">
            <div v-if="!isLoading">
              <div class="grid-container">
                <div
                  v-for="data in bookingData"
                  :key="data.id"
                  class="seat-card"
                  :class="{
                    occupied: !isTableFree(data.id),
                    free: isTableFree(data.id),
                    selected: attributesToBookTable.selectedTableId === data.id,
                    highlight: attributesToBookTable.selectedTableId === data.id
                  }"
                  @click="handleSeatClick(data)"
                  >
                  <q-card flat bordered class="seat-content"  @mouseenter="openDialog(data)">
                    <div class="text-h6">{{ data.seatId }}</div>
                    <div class="text-subtitle2">{{ data.place }}</div>
                    <div class="text-caption">
                      {{ data.meetingRoom ? 'MR: ' + data.seats + ' Plätze' : 'Einzelplatz' }}
                    </div>
                    <div class="text-caption">
                      {{ isTableFree(data.id) ? 'Frei' : 'Besetzt' }}
                    </div>

                    <q-tooltip v-if="!data.isFree" anchor="bottom middle" self="top middle" :offset="[0, 10]">
                      Besetzt von {{ windowData.startTime }} - {{ windowData.endTime }}
                    </q-tooltip>
                  </q-card>
                </div>
              </div>
            </div>

            <div v-else-if="isLoading" class="grid-container">
              <div
                v-for="n in 20"
                :key="n"
                >
                <q-card flat bordered class="seat-content" style="background-color: #e0e0e0; display: flex; flex-direction: column; gap: 4px; align-items: center; padding: 8px;">
                  <div class="skeleton" style="width: 100px; border-radius: 16px;">1.1</div>
                  <div class="skeleton" style="width: 60px; border-radius: 16px;">I</div>
                  <div class="skeleton" style="width: 80px; border-radius: 16px;">I</div>
                  <div class="skeleton" style="width: 45px; border-radius: 16px;">I</div>
                </q-card>
              </div>
            </div>


          </q-scroll-area>
          </div>
      </div>


      <div style="display: flex; flex-direction: row; min-width: 100%; justify-content: center; margin-top: 4px;">
        <div class="q-pa-md">
          <div class="q-gutter-sm row">
            <q-input filled v-model="attributesToBookTable.startTime" mask="time" :rules="['startTime']"
              label="Startzeit" style="max-width: 160px;">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="attributesToBookTable.startTime">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />

                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>


        <div class="q-pa-md">
          <div class="q-gutter-sm row">
            <q-input filled v-model="attributesToBookTable.endTime" mask="time" :rules="['endTime']" label="Endzeit"
              style="max-width: 160px;">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="attributesToBookTable.endTime">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="q-pa-md" v-if="!isSmallScreen">
          <div class="q-gutter-sm row">
            <q-select label="Andere Optionen" no-caps style="min-width: 160px; max-width: 160px;"
              :options="otherTimeOptions" v-model="selectedTime"></q-select>
          </div>
        </div>

      </div>

      <div style="display: flex; min-width: 100%; justify-content: space-around; margin-bottom: 68px;">
        <q-btn label="Buchen" id="3" name="book" class="bookbutton" style="background-color: #17354f; color: white;"
          @click="bookTable()"></q-btn>
      </div>

    </div>

    <div class="bookings">
      <div class="overline">
        <br>
        <br>
        <p class="overlinetext">Meine Buchungen</p>

      </div>


      <div
        style="display: flex; justify-content: center; flex-direction: column; align-items: center; width: fit-content; width: 84%;">
        <h6 style="margin: 40px 0 0 0;">Hallo {{ name }}</h6>
        <h6 style="margin: 0px;">Ihre heutige Buchung:</h6>
        <div class="bookingCard" v-if="todaysBooking" style="width: 100%;">
          <div class="bookingCardTitle">
            <div style="display: flex; align-items: center;">
              <img src="/date_range.png" style="width: 32px;">
              <a style="margin-left: 12px; font-size: medium;">Sitzplatz: {{ todaysBooking.table.seatId }}</a>
            </div>
            <a>{{ todaysBooking.table.meetingRoom ? 'MR' : ''}}</a>
            <a>{{ todaysBooking.table.place }}</a>
          </div>
          <div style="min-width: 100%; display: flex; justify-content: space-between;">
            <a>{{ todaysBooking.formattedStartTime }} - {{ todaysBooking.formattedEndTime }}</a>
            <q-btn size="11px" icon="close" style="max-width: 28px; max-height: 28px; background-color: #F28B82;" @click="confirmDeletion(todaysBooking)">
              <q-tooltip>Buchung hier löschen</q-tooltip>
            </q-btn>
          </div>
        </div>

        <div v-else style="margin: 30px 0 30px 0">
          Sie haben heute leider keinen Sitzplatz
        </div>
      </div>

      <div
        style="display:flex; min-width: 90%; min-height: fit-content; border-radius: 20px; justify-content: center; padding: 0 12px 0 12px; flex-direction: column; align-items: center; background-color: #17354f; margin-bottom: 16px;">
        <h6 style="margin: 20px 0 0 0; color: white">Alle Buchungen</h6>

        <div v-if="myBookings && myBookings.length"
          style="width: 100%; height: fit-content; max-height: 400px; min-height: 400px;">
          <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100%; max-width: 100%;">
            <div class="bookingCard" v-for="(i, index) in myBookings" :key="i.id">
              <div class="bookingCardTitle">
                <div style="display: flex; align-items: center;">
                  <img src="/date_range1.png" style="width: 32px;">
                  <a style="margin-left: 12px; font-size: medium; color: white;">Sitzplatz: {{ i.table.seatId }}</a>
                </div>
                <a style="color: white;">{{ i.table.meetingRoom ? 'MR' : ''}}</a>
                <a style="color: white;">{{ i.table.place }}</a>
              </div>
              <div style="min-width: 100%; display: flex; justify-content: space-between;">
                <a style=" color: white;">{{ i.startTime }} - {{ i.endTime }}</a>
                <q-btn size="11px" icon="close" style="max-width: 28px; max-height: 28px; background-color: #F28B82;" @click="confirmDeletion(i)">
                  <q-tooltip>Buchung hier löschen</q-tooltip>
                </q-btn>
              </div>
              <div v-if="index < myBookings.length - 1" style="display: flex; justify-content: left; min-width: 100%">
                <hr style="border-color: white; min-width: 80%;">
              </div>
            </div>
          </q-scroll-area>
        </div>


        <div v-else>
          <h4>Keine Buchungen</h4>
        </div>
      </div>
    </div>
  </q-page>

  <q-dialog v-model="windowDeleteBooking">
    <q-card style="min-width: fit-content; max-height: fit-content; padding: 0px;">
      <q-card-section style="min-height: 100px; max-height: 100px; margin-top: -30px; margin-bottom: 20px;">          
        <h6 style="padding: 0;">Wollen Sie ihre Buchung wirklich stornieren?</h6>  
      </q-card-section>
      <q-card-actions style="display: flex; justify-content: space-between;">
          <q-btn flat label='Schließen' v-close-popup no-caps></q-btn>
          <q-btn flat label='Stornieren' v-close-popup no-caps @click="deleteBooking(booking)"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="windowDisplayPlan">
    <q-card
      v-if="appendixLoaded"
      style="min-width: 50%; max-height: 90vh; padding: 16px; overflow: auto; display: flex; justify-content: center;"
    >
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="img in computedAppendix" :key="img">
          <h5 style="margin-bottom: 8px;">Standort: {{ img.place ? img.place : "Keine Angabe" }}</h5>
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

</template>

<script>
import { defineComponent, ref, onMounted, watchEffect, watch, computed } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const $q = useQuasar()
    const today = new Date()
    const name = ref("")
    const token = JSON.parse(atob(localStorage.getItem("accesstoken").split(".")[1]))
    const otherTimeOptions = ref([
      "Vormittags",
      "Nachmittags",
      "Den ganzen Tag",
    ])
    const selectedTime = ref("")
    const bookingData = ref({})
    const myBookings = ref({})
    const todaysBooking = ref(null)
    const selectedCheckBox = ref(false)
    const attributesToBookTable = ref({
      selectedTableId: null,
      startTime: '08:00',
      endTime: '16:00',
      date: ""
    })
    const hover = ref(false)
    const windowData = ref({
      startTime: "",
      endTime: ""
    })
    const currentData = ref([])
    const isLoading = ref(true)
    const grantAllowanceToLoad = ref(false)
    const windowDeleteBooking = ref(false)
    const windowDisplayPlan = ref(false)
    const tempBookingForDeletion = ref(null)
    const computedAppendix = ref(null)
    const appendixLoaded = ref(false)
    const isSmallScreen = computed(() => $q.screen.width < 820)

    onMounted(async () => {
      try {
        name.value = token.name
        attributesToBookTable.value.id = token.id
        attributesToBookTable.value.date = today.getFullYear() + '/' +
          String(today.getMonth() + 1).padStart(2, '0') + '/' +
          String(today.getDate()).padStart(2, '0');
        bookingData.value = (await api.get('/api/getAllTables', {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
        myBookings.value = (await api.post('/api/getSpecificBookings', { id: token.id }, {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
        checkForTodaysBooking(myBookings)
        myBookings.value = formatBookingTimes(myBookings.value)
      } catch (err) {
        if (err.status == 404) {
          myBookings.value = null
        }
      }
      const startTime1 = convertDateStringToLocalISO(attributesToBookTable.value.date + " " + attributesToBookTable.value.startTime) + "+02"
      const endTime1 = convertDateStringToLocalISO(attributesToBookTable.value.date + " " + attributesToBookTable.value.endTime) + "+02"

      await enrichWithAvailability(startTime1, endTime1)
      loadImages()
      appendixLoaded.value = true

      await new Promise(resolve => setTimeout(resolve, 300));
      isLoading.value = false
      grantAllowanceToLoad.value = true
    })

    watch(() => attributesToBookTable.value.date, async () => {
      if(!attributesToBookTable.value.date){
        isLoading.value = true
      } else {
        if(grantAllowanceToLoad.value){
          await checkAvailabiliy()
          attributesToBookTable.value.selectedTableId = false
          isLoading.value = false
        }
      }
    })

    watch(() => attributesToBookTable.value.startTime, async () => {
      await checkAvailabiliy()
      if(!isTableFree(attributesToBookTable.value.selectedTableId)){
        attributesToBookTable.value.selectedTableId = false
      }
    })

    watch(() => attributesToBookTable.value.endTime, async () => {
      await checkAvailabiliy()
      if(!isTableFree(attributesToBookTable.value.selectedTableId)){
        attributesToBookTable.value.selectedTableId = false
      }
    })

    watchEffect(() => {
      if (selectedTime.value == "Vormittags") {
        attributesToBookTable.value.startTime = "06:00"
        attributesToBookTable.value.endTime = "12:00"
      } else if (selectedTime.value == "Nachmittags") {
        attributesToBookTable.value.startTime = "12:00"
        attributesToBookTable.value.endTime = "18:00"
      } else if (selectedTime.value == "Den ganzen Tag") {
        attributesToBookTable.value.startTime = "06:00"
        attributesToBookTable.value.endTime = "18:00"
      }
    })

    async function bookTable() {
      try {
        const dataForBooking = {
          userId: attributesToBookTable.value.id,
          tableId: attributesToBookTable.value.selectedTableId,
          start: attributesToBookTable.value.date + " " + attributesToBookTable.value.startTime,
          end: attributesToBookTable.value.date + " " + attributesToBookTable.value.endTime,
        }
        if(isValidTimeRange(dataForBooking.start, dataForBooking.end)) {
          await api.post('/api/createBooking', dataForBooking, {headers: {"authorization": localStorage.getItem('accesstoken')}})
          $q.notify({
            message: "Erfolgreich gebucht.",
            type: "positive",
            timeout: 2000
          })
          bookingData.value = (await api.get('/api/getAllTables', {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
          myBookings.value = (await api.post('/api/getSpecificBookings', { id: token.id }, {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
          checkForTodaysBooking()
          myBookings.value = formatBookingTimes(myBookings.value)
  
          await checkAvailabiliy()
          attributesToBookTable.value.selectedTableId = false
        } else {
          $q.notify({
            message: "Falsche Uhrzeit angegeben.",
            type: "negative",
            timeout: 2000
          })
        }
      } catch (err) {
        if(err.response.data.error.name == "SequelizeValidationError"){
          $q.notify({
            message: "Bitte Tisch auswählen.",
            type: "negative",
            timeout: 2000
          })
        }
        // console.log(err)
      }
    }

    function isValidTimeRange(startStr, endStr) {
      const start = new Date(startStr.replace(/[/]/g, '-'));
      const end = new Date(endStr.replace(/[/]/g, '-'));

      if (end <= start) {
        return false;
      }

      const isSameDay = (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()
      );

      return isSameDay;
    }

    function formatBookingTimes(bookings) {
      return bookings.map(booking => {
        return {
          ...booking,
          startTime: formatDateTime(booking.startTime),
          endTime: formatDateTime(booking.endTime)
        }
      });
    }

    function formatDateTime(dateString) {
      const date = new Date(dateString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    function formatTodaysBooking(booking) {
      const pad = n => n.toString().padStart(2, '0');

      const formatISO = iso => {
        const d = new Date(iso);
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const min = pad(d.getMinutes());
        return `${year}/${month}/${day} ${hour}:${min}`;
      };

      return {
        ...booking,
        formattedStartTime: formatISO(booking.startTime),
        formattedEndTime: formatISO(booking.endTime)
      };
    }

    function checkForTodaysBooking() {
      var checkVar = 0
      for (var i in myBookings.value) {
        const bookingDate = myBookings.value[i].startTime.slice(0, 10)
        const today = new Date().toISOString().slice(0, 10)
        if (bookingDate === today) {
          checkVar = checkVar + 1
          todaysBooking.value = myBookings.value[i]
          const index = myBookings.value.findIndex(item => item.id === todaysBooking.value.id)
          if (index !== -1) {
            myBookings.value.splice(index, 1)
          }
        }
      }
      if(checkVar == 0) {
        todaysBooking.value = null
      } else {
        todaysBooking.value = formatTodaysBooking(todaysBooking.value)
      }
    }

    function convertDateStringToLocalISO(input) {
      const [datePart, timePart] = input.split(' ')
      const [year, month, day] = datePart.split('/').map(s => s.padStart(2, '0'))
      const [hour, minute] = timePart.split(':').map(s => s.padStart(2, '0'))

      return `${year}-${month}-${day}T${hour}:${minute}:00`
    }

    async function enrichWithAvailability(startTime1, endTime1) {
      currentData.value = []
      for (let i = 0; i < bookingData.value.length; i++) {
        const table = bookingData.value[i]
        const { data } = await api.post('/api/checkForFreeTable', {
          tableId: table.id,
          startTime: startTime1,
          endTime: endTime1
        }, {headers: {"authorization": localStorage.getItem('accesstoken')}})
        table.isFree = data.isFree
        currentData.value.push({
          tableId: table.id,
          data: data
        })
      }
    }

    async function checkAvailabiliy() {
      const startTime1 = convertDateStringToLocalISO(attributesToBookTable.value.date + " " + attributesToBookTable.value.startTime) + "+02"
      const endTime1 = convertDateStringToLocalISO(attributesToBookTable.value.date + " " + attributesToBookTable.value.endTime) + "+02"

      await enrichWithAvailability(startTime1, endTime1)
    }

    async function openDialog(data) {
      if(data.isFree == true) {return}
      for (var entry in currentData.value) {
        if (currentData.value[entry].tableId == data.id) {
          windowData.value.startTime = addHoursToTime(
            currentData.value[entry].data.data.startTime.slice(11, 16), 2)
          windowData.value.endTime = addHoursToTime(
            currentData.value[entry].data.data.endTime.slice(11, 16), 2)
        }
      }
    }

    function addHoursToTime(timeStr, hoursToAdd) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      let totalMinutes = hours * 60 + minutes + hoursToAdd * 60

      totalMinutes = totalMinutes % 1440

      const newHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
      const newMinutes = String(totalMinutes % 60).padStart(2, '0')

      return `${newHours}:${newMinutes}`
    }

    async function deleteBooking() {
      try {
        var booking = tempBookingForDeletion.value
        await api.delete(`/api/deleteBooking?id=${booking.id}`,{headers: {"authorization": localStorage.getItem('accesstoken')}})
        myBookings.value = (await api.post('/api/getSpecificBookings', {id: token.id }, {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
        bookingData.value = (await api.get('/api/getAllTables', {headers: {"authorization": localStorage.getItem('accesstoken')}})).data.data
        checkForTodaysBooking()
        myBookings.value = formatBookingTimes(myBookings.value)
        $q.notify({
          message: "Erfolgreich gelöscht.",
          type: "positive",
          timeout: 2000
        })
        await checkAvailabiliy()
        attributesToBookTable.value.selectedTableId = false
      } catch (err) {
        if(err.status == 404) {
          todaysBooking.value = null
        }
      }
      tempBookingForDeletion.value = null
    }

    function isTableFree(id) {
      const entry = currentData.value.find(e => e.tableId === id);
      return entry?.data?.isFree ?? false;
    }

    function handleSeatClick(data) {
      if(data.isFree == false){
        openDialog(data.id)
        return
      }
      if(attributesToBookTable.value.selectedTableId == data.id) {
        attributesToBookTable.value.selectedTableId = false
      } else {
        attributesToBookTable.value.selectedTableId = data.id
      }
    }

    function confirmDeletion(booking) {
      windowDeleteBooking.value = true
      tempBookingForDeletion.value = booking
    }

    function showImage(){
      windowDisplayPlan.value = true
    }

    async function loadImages() {
      computedAppendix.value = await (await api.get("/api/appendix")).data.data
      // console.log(computedAppendix.value)
    }

    return {
      name,
      otherTimeOptions,
      selectedTime,
      bookingData,
      myBookings,
      selectedCheckBox,
      attributesToBookTable,
      todaysBooking,
      hover,
      windowData,
      isLoading,
      windowDeleteBooking,
      windowDisplayPlan,
      appendixLoaded,
      computedAppendix,
      isSmallScreen,
      showImage,
      confirmDeletion,
      openDialog,
      bookTable,
      checkAvailabiliy,
      deleteBooking,
      isTableFree,
      handleSeatClick,
      loadImages,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        width: '5px',
        opacity: 0.75,
        backgroundColor: '#17354f',
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        width: '9px',
        opacity: 0.2,
      }
    }
  }
});
</script>

<style>
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
}

.calender {
  flex: 1 1 0;
  min-width: 320px;
  background-color: #E0E0E0;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 16px;
}

.table {
  flex: 2 1 0;
  background-color: #E0E0E0;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bookings {
  flex: 1 1 0;
  min-width: 300px;
  background-color: #E0E0E0;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timebutton {
  background-color: #E0E0E0;
  color: black;
  border: none;
  border-radius: 999px;
  padding: 15px 44px;
  font-size: 17px;
  margin: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.bookbutton {
  border: none;
  border-radius: 999px;
  padding: 15px 44px;
  font-size: 17px;
  margin-top: -12px;
}


.deskview {
  margin-top: 20px;
  background-color: white;
  min-height: 55%;
  min-width: 80%;
  max-height: 55%;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
}

.overline {
  min-width: 100%;
  max-width: 100%;
  min-height: 14%;
  max-height: 14%;
  background-color: #E0E0E0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}

.overlinetext {
  color: black;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  align-items: center;
  vertical-align: text-bottom;
}


.bookingCard {
  min-width: 94%;
  max-height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin: 10px;
}

.bookingCardTitle {
  min-width: 100%;
  max-height: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.hr.solid {
  margin: 0;
  margin-top: 20px;
  margin-bottom: 16px;
  padding: 0;
  border-top: 1px solid #000000;
  width: 100%;
}

/** Tabledesign --------------------------------------------- */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  padding: 10px;
}

.seat-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.seat-card:hover {
  transform: scale(1.03);
}

.seat-content {
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  background-color: #e0f7fa;
  transition: background-color 0.6s ease, box-shadow 0.6s ease;
  position: relative;
  overflow: hidden;
}

.seat-card.free .seat-content {
  background-color: #e0f7fa; 
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 200, 100, 0.15); 
}

.seat-card.free .seat-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 260%;
  height: 100%;
  background: radial-gradient(
    circle at 10% 50%,
    rgba(0, 200, 100, 0.3), 
    rgba(0, 200, 100, 0) 75%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}
  
.seat-card.free .seat-content > * {
  position: relative;
  z-index: 1;
}

.seat-card.occupied .seat-content {
  background-color: #fcebea; 
  cursor: not-allowed;
  opacity: 0.9;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(242, 139, 130, 0.3);
}

.seat-card.occupied .seat-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 240%;
  height: 100%;
  background: radial-gradient(
    circle at 10% 50%,
    rgba(242, 80, 80, 0.65),
    rgba(242, 80, 80, 0) 75%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}

.seat-card.occupied .seat-content > * {
  position: relative;
  z-index: 1;
}

.seat-card.highlight .seat-content {
  background-color: #f0fdfa;
  box-shadow: inset 0 0 12px rgba(255, 249, 196, 0.25);
}

.seat-card.highlight .seat-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 260%;
  height: 100%;
  background: radial-gradient(
    circle at 10% 50%,
    rgba(255, 235, 100, 0.75),
    rgba(255, 235, 100, 0) 75%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
  animation: none;
}

.seat-card .seat-content > * {
  position: relative;
  z-index: 1;
}

@keyframes sunlight-sweep {
  from {
    left: -80%;
  }
  to {
    left: 0%;
  }
}

/** Skeletons ------------------------------------------------*/
.skeleton {
  background-color: #a0a0a0;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  color: transparent; 
}

.skeleton::before {
  content: '';
  position: absolute;
  top: 0; left: -150%;
  height: 100%;
  width: 150%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: loading-sweep 1.5s infinite;
  pointer-events: none;
}

@keyframes loading-sweep {
  0% {
    left: -150%;
  }
  100% {
    left: 100%;
  }
}

.appendix-button {
  padding: 0;
  background-color: white;
  position: relative;
  span {
    width: 100%!important;
    height: 100%!important;
    position: relative;
  }
  img {
    width: inherit;
    height: inherit;
    object-fit: contain;
  }
}

</style>