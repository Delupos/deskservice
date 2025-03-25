<template>
  <q-page class="content">

    <div class="calender">
      <img src="/logo.png" style="width: 260px;">
      <div class="q-pa-md">
        <div class="q-gutter-md row items-start">
          <q-date v-model="date" minimal style="background-color: transparent;" />
        </div>
      </div>
      <h6 style="margin: 0px; margin-top: 20px;">Ihr ausgewähltes Datum:</h6>
      <h5 style="margin: 0px;">{{ date }}</h5>
    </div>

    <div class="table">
      <h1>Test1</h1>
    </div>

    <div class="bookings">
      <h4 style="margin: 40px 0 0 0;">Meine Buchungen:</h4>

      <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
        <h6 style="margin: 40px 0 0 0;">Hallo {{ name }}</h6>
        <h6 style="margin: 0px;">Ihre heutige Buchung:</h6>
        <h6 style="margin: 0px;">None</h6>
      </div>  
      
      <div style="display:flex; min-width: 100%; min-height: fit-content; background-color: white; border-radius: 20px; justify-content: center; padding: 0 12px 0 12px; flex-direction: column; align-items: center;">
        <h6 style="margin: 20px 0 0 0;">Alle Buchungen</h6>
        
        <div class="bookingCard" v-for="i in testData" v-bind:key="i">
          <div class="bookingCardTitle">
            <img src="/date_range.png" style="width: 32px;">
            <a style="margin-left: 12px; font-size: medium;">Sitzplatz: xxx {{ i }}</a>
          </div>
          <a>01.01.2024 00:00 - 31.12.2025 23:59</a>
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
    const testData = ref([1,2,3])
    

    onMounted(async() => {
      name.value = token.name
    })

    return {
      date,
      name,
      testData
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

.table {
  min-width: 50%;
  max-width: 50%;
  min-height: 100%;
  background-color: #A4D3F2;
  border-radius: 40px;
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
  padding: 10px;
  gap: 40px;
}

.bookingCard {
  min-width: 100%;
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