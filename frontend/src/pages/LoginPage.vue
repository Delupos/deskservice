<template>
    <q-page class="flex flex-center">
        <div class="content">
            <div
                style="min-height: 120px; max-height: 120px; min-width: max-content; display: flex; align-items: center; justify-content: left;">
                <h3 style="margin: 0px; margin-left: -8px;">
                    Desk-Service
                </h3>
            </div>
            <div class="content-rows">
                <h6 style="margin: 0px; margin-bottom: -4px;">
                    Login:
                </h6>
            </div>
            <div class="input">
                <q-input v-model="dataLogin.email" label="*E-Mail" @keydown.enter.prevent="Login()" />
            </div>
            <div class="input">
                <q-input v-model="dataLogin.password" label="*Password" type="password"
                    @keydown.enter.prevent="Login()" />
            </div>
            <div class="content-rows" style="margin-top: 4px;">
                <q-btn label="Einloggen" no-caps
                    style="border-radius: 20px; background-color: #0068AE; color: white; font-size: medium; min-width: 50%;"
                    @click="Login()" />
            </div>

            <hr class="solid">

            <div class="content-rows">
                <q-btn label="Passwort vergessen" no-caps
                    style="border-radius: 20px; background-color: #0068AE; color: white; font-size: medium; min-width: 50%;" />
                <q-btn label="Account erstellen" no-caps
                    style="border-radius: 20px; background-color: #0068AE; color: white; font-size: medium; min-width: 50%;" />
            </div>
        </div>
    </q-page>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'LoginPage',

    setup() {
        const dataLogin = ref({
            email: "",
            password: ""
        })

        const $q = useQuasar()
        const router = useRouter()


        async function Login() {
            if (dataLogin.value.email == "" || dataLogin.value.password == "") {
                $q.notify({
                    message: 'Füllen Sie alle Felder aus.',
                    icon: 'announcement'
                })
                return
            }

            try {
                const result = await api.post('/api/checkLogin', dataLogin.value)

                if (result.status == 204) {
                    $q.notify({
                        message: "Error: 204 Message: User blocked",
                        color: "negative"
                    })
                } else {

                    $q.notify({
                        message: "Login war erfolgreich",
                        color: "positive"
                    })

                    localStorage.setItem('accesstoken', result.data.accessToken)
                    router.push('..')
                }

            } catch (err) {
                $q.notify({
                    message: "Error: " + err.response.status + "\nMessage: " + err.response.data.error,
                    color: "negative"
                })

            }
        }

        return {
            dataLogin,
            Login
        }
    }
});
</script>


<style>
.content {
    min-width: 500px;
    max-width: 500px;
    min-height: max-content;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    margin-bottom: 240px;
}

.content-rows {
    min-width: max-content;
    min-height: fit-content;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 16px;
}

.input {
    min-width: 480px;
    border-radius: 12px;
}

hr.solid {
    margin: 0;
    margin-top: 20px;
    margin-bottom: 16px;
    padding: 0;
    border-top: 1px solid #000000;
    width: 100%;
}
</style>