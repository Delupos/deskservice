<template>
  <q-page class="content">

    <div class="calender">
      <img src="/logo.png" style="width: 260px;">
      <div class="q-pa-md">
        <div class="q-gutter-md row items-start">
          <q-date v-model="date" minimal style="background-color: #D9DBF1; color: black;" />
        </div>
      </div>
      <h6 style="margin: 0px; margin-top: 20px;">Ihr ausgewähltes Datum:</h6>
      <h5 style="margin: 0px;">{{ date }}</h5>
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

        <q-list class="q-pa-md" v-for="data in bookingData" v-bind:key="data">
          <q-item>
            <q-item-section>{{ data["seatId"] }}</q-item-section>
            <q-item-section>{{ data["place"] }}</q-item-section>
            <q-item-section>Status</q-item-section>
            <q-item-section><q-checkbox v-model="test"/></q-item-section>
          </q-item>
        </q-list>       

      </div>


      <div style="display: flex; flex-direction: row; min-width: 100%; justify-content: center; margin-top: 4px;">
        <div class="q-pa-md">
          <div class="q-gutter-sm row">
            <q-input filled v-model="starttime" mask="time" :rules="['starttime']" label="Startzeit" style="max-width: 160px;">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="starttime">
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
            <q-input filled v-model="endtime" mask="time" :rules="['endtime']" label="Endzeit" style="max-width: 160px;">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="endtime">
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
            <q-select label="Andere Optionen" no-caps style="min-width: 160px; max-width: 160px;" :options="otherTimeOptions" v-model="selectedTime"></q-select>
          </div>
        </div>

      </div>

      <div style="display: flex; min-width: 100%; justify-content: center;">
        <q-btn label="Buchen" id="3" name="book" class="bookbutton" style="background-color: #D9DBF1; color: black;" @click="bookTable()"></q-btn>
      </div>

    </div>

    <div class="bookings">
      <div class="overline">
        <br>
        <br>
        <p class="overlinetext">Meine Buchungen</p>

      </div>


      <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
        <h6 style="margin: 40px 0 0 0;">Hallo {{ name }}</h6>
        <h6 style="margin: 0px;">Ihre heutige Buchung:</h6>
        <h6 style="margin: 0px;">None</h6>
      </div>

      <div
        style="display:flex; min-width: 90%; min-height: fit-content; background-color: white; border-radius: 20px; justify-content: center; padding: 0 12px 0 12px; flex-direction: column; align-items: center; background-color: #D9DBF1;">
        <h6 style="margin: 20px 0 0 0;">Alle Buchungen</h6>

        <div class="bookingCard" v-for="i in myBookings" v-bind:key="i">
          <div class="bookingCardTitle">
            <div style="display: flex; align-items: center;">
              <img src="/date_range.png" style="width: 32px;">
              <a style="margin-left: 12px; font-size: medium;">Sitzplatz: {{ i.table.seatId }}</a>
            </div>
            <a>{{ i.table.place }}</a>
          </div>
          <a>{{ i.startTime }} - {{ i.endTime }}</a>
          <div style="display: flex; justify-content: left; min-width: 100%">
            <hr style="border-color: black; min-width: 80%;">
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watchEffect } from 'vue';
import { api } from 'src/boot/axios';

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const date = ref('')
    const today = new Date()
    const name = ref("")
    const token = JSON.parse(atob(localStorage.getItem("accesstoken").split(".")[1]))
    const starttime = ref('08:00')
    const endtime = ref('16:00')
    const otherTimeOptions = ref([
      "Vormittags",
      "Nachmittags",
      "Den ganzen Tag",
    ])
    const selectedTime = ref("")
    const testData = ref([1, 2, 3])
    const bookingData = ref({})
    const myBookings = ref({})
    const test = ref(false)


    onMounted(async () => {
      name.value = token.name
      date.value = today.getFullYear() + '/' + 
                      String(today.getMonth() + 1).padStart(2, '0') + '/' + 
                      String(today.getDate()).padStart(2, '0');
      bookingData.value = (await api.get('/api/getAllTables')).data.data
      myBookings.value = (await api.post('/api/getSpecificBookings', {id: token.id})).data.data
      myBookings.value = formatBookingTimes(myBookings.value)
    })

    watchEffect(() => {
      if(selectedTime.value == "Vormittags"){
        starttime.value = "06:00"
        endtime.value = "12:00"
      } else if (selectedTime.value == "Nachmittags"){
        starttime.value = "12:00"
        endtime.value = "18:00"       
      } else if (selectedTime.value == "Den ganzen Tag"){
        starttime.value = "06:00"
        endtime.value = "18:00"       
      }
    })

    function bookTable() {
      console.log("Tisch buchen am "+date.value+" von "+starttime.value+"-"+endtime.value+" Uhr")
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


    return {
      date,
      name,
      testData,
      starttime,
      endtime,
      otherTimeOptions,
      selectedTime,
      bookingData,
      myBookings,
      test,
      bookTable
    }
  }
});
</script>

<style>
.content {
  width: 99%;
  height: 1vh;
  display: flex;
  justify-content: left;
  gap: 12px;
  padding: 12px;
}

.calender {
  min-width: 25%;
  max-width: 25%;
  min-height: 100%;
  background-color: #E7ECF3;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.table {
  min-width: 50%;
  max-width: 50%;
  min-height: 100%;
  background-color: #E7ECF3;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  vertical-align: text-bottom;
}

.bookings {
  min-width: 25%;
  max-width: 25%;
  min-height: 100%;
  background-color: #E7ECF3;
  border-radius: 40px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  flex-direction: column;
  padding: 0px;
  gap: 40px;
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