<template>
  <q-page class="content">

    <div class="calender">
      <img src="/logo1.jpeg" style="width: 260px; margin-top: 100px; margin-bottom: 40px;">
      <div class="q-pa-md">
        <div class="q-gutter-md row items-start">
          <q-date v-model="attributesToBookTable.date" minimal style="background-color: #D9DBF1; color: black;" />
        </div>
      </div>
      <h6 style="margin: 0px; margin-top: 20px;">Ihr ausgewähltes Datum:</h6>
      <h5 style="margin: 0px;">{{ attributesToBookTable.date }}</h5>
    </div>

    <div class="table">
      <div class="overline">
        <p class="overlinetext">
          <br>
          Raumübersicht
        </p>
      </div>

      <div class="deskview">

        <q-list class="q-pa-md">
          <q-item>
            <q-item-section>Tisch</q-item-section>
            <q-item-section>Ort</q-item-section>
            <q-item-section>Status</q-item-section>
            <q-item-section>Buchen</q-item-section>
          </q-item>
        </q-list>

        <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"
          style="max-height: 84%; min-height: 84%; width: 100%; overflow-y: auto; display: flex; flex-wrap: wrap;">
          <q-list class="q-pa-md" v-for="data in bookingData" v-bind:key="data">
            <q-item>
              <q-item-section>{{ data["seatId"] }}</q-item-section>
              <q-item-section>
                <p v-if="data.isFree" style="padding: 0%; margin: 0;">{{ data["place"] }}</p>
                <s v-else style="cursor: pointer;" @click="openDialog(data.id)">{{ data["place"] }}</s>
              </q-item-section>
              <q-item-section>{{ data.isFree ? 'Frei' : 'Besetzt' }}</q-item-section>
              <q-item-section>
                <q-checkbox v-model="selectedCheckBox" :model-value="attributesToBookTable.selectedTableId === data.id"
                  @update:model-value="val => attributesToBookTable.selectedTableId = val ? data.id : null"
                  :disable="!data.isFree" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
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

        <div class="q-pa-md">
          <div class="q-gutter-sm row">
            <q-select label="Andere Optionen" no-caps style="min-width: 160px; max-width: 160px;"
              :options="otherTimeOptions" v-model="selectedTime"></q-select>
          </div>
        </div>

      </div>

      <div style="display: flex; min-width: 100%; justify-content: space-around; margin-bottom: 68px;">
        <q-btn label="Buchen" id="3" name="book" class="bookbutton" style="background-color: #D9DBF1; color: black;"
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
            <a>{{ todaysBooking.table.place }}</a>
          </div>
          <div style="min-width: 100%; display: flex; justify-content: space-between;">
            <a>{{ todaysBooking.formattedStartTime }} - {{ todaysBooking.formattedEndTime }}</a>
            <q-btn size="11px" icon="close" style="max-width: 28px; max-height: 28px;" @click="deleteBooking(todaysBooking)">
              <q-tooltip>Buchung hier löschen</q-tooltip>
            </q-btn>
          </div>
        </div>

        <div v-else>
          Sie haben heute leider keinen Sitzplatz
        </div>
      </div>

      <div
        style="display:flex; min-width: 90%; min-height: fit-content; border-radius: 20px; justify-content: center; padding: 0 12px 0 12px; flex-direction: column; align-items: center; background-color: #D9DBF1;">
        <h6 style="margin: 20px 0 0 0;">Alle Buchungen</h6>

        <div v-if="myBookings && myBookings.length"
          style="width: 100%; height: fit-content; max-height: 400px; min-height: 400px;">
          <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100%; max-width: 100%;">
            <div class="bookingCard" v-for="(i, index) in myBookings" :key="i.id">
              <div class="bookingCardTitle">
                <div style="display: flex; align-items: center;">
                  <img src="/date_range.png" style="width: 32px;">
                  <a style="margin-left: 12px; font-size: medium;">Sitzplatz: {{ i.table.seatId }}</a>
                </div>
                <a>{{ i.table.place }}</a>
              </div>
              <div style="min-width: 100%; display: flex; justify-content: space-between;">
                <a>{{ i.startTime }} - {{ i.endTime }}</a>
                <q-btn size="11px" icon="close" style="max-width: 28px; max-height: 28px;" @click="deleteBooking(i)">
                  <q-tooltip>Buchung hier löschen</q-tooltip>
                </q-btn>
              </div>
              <div v-if="index < myBookings.length - 1" style="display: flex; justify-content: left; min-width: 100%">
                <hr style="border-color: black; min-width: 80%;">
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

  <q-dialog v-model="windowTakenSeat">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ windowData.startTime }} - {{ windowData.endTime }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, watchEffect, watch } from 'vue';
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
    const testData = ref([1, 2, 3])
    const bookingData = ref({})
    const myBookings = ref({})
    const todaysBooking = ref(null)
    const selectedCheckBox = ref(false)
    const attributesToBookTable = ref({
      selectedTableId: false,
      startTime: '08:00',
      endTime: '16:00',
      date: ""
    })
    const hover = ref(false)
    const windowTakenSeat = ref(false)
    const windowData = ref({
      startTime: "",
      endTime: ""
    })
    const currentData = ref([])

    onMounted(async () => {
      try {
        name.value = token.name
        attributesToBookTable.value.id = token.id
        attributesToBookTable.value.date = today.getFullYear() + '/' +
          String(today.getMonth() + 1).padStart(2, '0') + '/' +
          String(today.getDate()).padStart(2, '0');
        bookingData.value = (await api.get('/api/getAllTables')).data.data
        myBookings.value = (await api.post('/api/getSpecificBookings', { id: token.id })).data.data
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
    })

    watch(() => attributesToBookTable.value.date, async () => {
      await checkAvailabiliy()
      attributesToBookTable.value.selectedTableId = false
    })

    watch(() => attributesToBookTable.value.startTime, async () => {
      await checkAvailabiliy()
      attributesToBookTable.value.selectedTableId = false
    })

    watch(() => attributesToBookTable.value.endTime, async () => {
      await checkAvailabiliy()
      attributesToBookTable.value.selectedTableId = false
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
        console.log(dataForBooking)
        await api.post('/api/createBooking', dataForBooking)
        $q.notify({
          message: "Erfolgreich gebucht.",
          type: "positive",
          timeout: 2000
        })
        myBookings.value = (await api.post('/api/getSpecificBookings', { id: token.id })).data.data
        checkForTodaysBooking()
        myBookings.value = formatBookingTimes(myBookings.value)
      } catch (err) {
        console.log(err)
      }
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
        })
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

    async function openDialog(id) {
      windowTakenSeat.value = true
      for (var entry in currentData.value) {
        if (currentData.value[entry].tableId == id) {
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

    async function deleteBooking(booking) {
      try {
        await api.delete(`/api/deleteBooking?id=${booking.id}`)
        myBookings.value = (await api.post('/api/getSpecificBookings', { id: token.id })).data.data
        checkForTodaysBooking()
        myBookings.value = formatBookingTimes(myBookings.value)
        $q.notify({
          message: "Erfolgreich gelöscht.",
          type: "positive",
          timeout: 2000
        })
      } catch {
        todaysBooking.value = null
      }
    }

    return {
      name,
      testData,
      otherTimeOptions,
      selectedTime,
      bookingData,
      myBookings,
      selectedCheckBox,
      attributesToBookTable,
      todaysBooking,
      hover,
      windowData,
      windowTakenSeat,
      openDialog,
      bookTable,
      checkAvailabiliy,
      deleteBooking,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        width: '5px',
        opacity: 0.75,
        backgroundColor: '#027be3',
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
  background-color: #E7ECF3;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table {
  flex: 2 1 0;
  min-width: 620px;
  background-color: #E7ECF3;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bookings {
  flex: 1 1 0;
  min-width: 300px;
  background-color: #E7ECF3;
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
  background-color: white;
  min-height: 60%;
  min-width: 80%;
  max-height: 60%;
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
  background-color: #E7ECF3;
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
</style>