<template>
  <q-page class="content">

    <div class="calender">
      <img src="/logo.png" style="width: 260px;">
      <div class="q-pa-md">
        <div class="q-gutter-md row items-start">
          <q-date v-model="date" minimal style="background-color: #0068ae; color: antiquewhite;" />
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
      <div class="deskview"> </div>


      <div style="display: flex; flex-direction: row; min-width: 100%; justify-content: center; margin-top: 4px;">
        <div class="q-pa-md">
          <div class="q-gutter-sm row">
            <q-input filled v-model="starttime" mask="time" :rules="['starttime']" label="Startzeit">
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
            <q-input filled v-model="endtime" mask="time" :rules="['endtime']" label="Endzeit">
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
      </div>

      <div style="display: flex; min-width: 100%; justify-content: center;">
        <button class="bookbutton" id="3" name="book">Buchen</button>
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
        style="display:flex; min-width: 90%; min-height: fit-content; background-color: white; border-radius: 20px; justify-content: center; padding: 0 12px 0 12px; flex-direction: column; align-items: center;">
        <h6 style="margin: 20px 0 0 0;">Alle Buchungen</h6>

        <div class="bookingCard" v-for="i in testData" v-bind:key="i">
          <div class="bookingCardTitle">
            <img src="/date_range.png" style="width: 32px;">
            <a style="margin-left: 12px; font-size: medium;">Sitzplatz: xxx {{ i }}</a>
          </div>
          <a>01.01.2024 00:00 - 31.12.2025 23:59</a>
          <hr style="border-color: black; min-width: 100%;">
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const date = ref('2025/03/24')
    const name = ref("")
    const token = JSON.parse(atob(localStorage.getItem("accesstoken").split(".")[1]))
    const starttime = ref('07:00')
    const endtime = ref('15:00')
    const testData = ref([1, 2, 3])


    onMounted(async () => {
      name.value = token.name
    })

    return {
      date,
      name,
      testData,
      starttime,
      endtime
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
  background-color: #A4D3F2;
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
  background-color: #8b6ff0;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 15px 44px;
  font-size: 17px;
  align-items: center;
  justify-content: center;
  margin-top: -12px;
}

.table {
  min-width: 50%;
  max-width: 50%;
  min-height: 100%;
  background-color: #A4D3F2;
  border-radius: 40px;
}

.deskview {
  background-color: white;
  min-height: 60%;
  min-width: 60%;
  max-height: 60%;
  max-width: 60%;
  display: flex;
  margin-left: 182px;
  margin-top: 30px;
}

.overline {
  min-width: 100%;
  max-width: 100%;
  min-height: 14%;
  max-height: 14%;
  background-color: #1f2a48;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}

.overlinetext {
  color: antiquewhite;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: text-bottom;


}

.bookings {
  min-width: 25%;
  max-width: 25%;
  min-height: 100%;
  background-color: #A4D3F2;
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
  margin: 10px;
}

.bookingCardTitle {
  min-width: 100%;
  max-height: fit-content;
  display: flex;
  align-items: center;
  justify-content: left;
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