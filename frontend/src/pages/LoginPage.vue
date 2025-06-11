<template>
    <q-page class="flex flex-center">
        <div class="content">
            <div
                style="min-height: 120px; max-height: 120px; min-width: max-content; display: flex; align-items: center; justify-content: left;">
                <h3 style="margin: 0px; margin-left: -8px;">
                    SmartSeat
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
                    style="border-radius: 20px; background-color: #17354f;; color: white; font-size: medium; min-width: 48%; font-size: 14px;"
                    @click="Login()" />
            </div>

            <hr class="solid">

            <div class="content-rows">
                <q-btn label="Passwort vergessen" no-caps @click="windowResetPsw = true"
                    style="border-radius: 20px; background-color: #17354f;; color: white; font-size: medium; min-width: 48%; font-size: 14px;" />
                <q-btn label="Account erstellen" no-caps @click="displayCreateAccount()"
                    style="border-radius: 20px; background-color: #17354f;; color: white; font-size: medium; min-width: 48%; font-size: 14px;" />
            </div>
        </div>
    </q-page>

    <q-dialog v-model="windowCreateAccount">
        <q-card style="min-width: 360px; max-width: 400px;">
            <q-card-section>
                <div class="text-h6">
                    Erstellen Sie ihren Account:
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*E-Mail" dense v-model="dataCreateAccount.email" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Name" dense v-model="dataCreateAccount.name" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Nachname" dense v-model="dataCreateAccount.surname" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input
                    label="*Passwort"
                    dense
                    v-model="dataCreateAccount.password"
                    :type="showPassword ? 'text' : 'password'"
                    autofocus
                    @keyup.enter="prompt = false"
                    >
                    <template v-slot:append>
                        <q-icon
                        :name="showPassword ? 'visibility' : 'visibility_off'"
                        class="cursor-pointer"
                        @click="showPassword = !showPassword"
                        />
                    </template>
                </q-input>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Passwort bestätigen" dense v-model="passwordSub" autofocus @keyup.enter="prompt = false" type="password"/>
            </q-card-section>
            
            <q-card-section class="q-pt-none" v-if="dataCreateAccount.password !== passwordSub">
                <a style="color: red;">Passwort muss bestätigt werden.</a>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Masterkey" dense v-model="dataCreateAccount.masterkey" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Geben Sie als Sicherheitsfrage Ihr Lieblingsreiseziel an:" dense v-model="dataCreateAccount.secQuest" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="Bei Adminrechte bitte das Kennwort angeben:" dense v-model="dataCreateAccount.admin" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Abbrechen" v-close-popup />
                <q-btn flat label="Account erstellen" v-close-popup @click="createAccount()" :disabled="dataCreateAccount.password !== passwordSub || dataCreateAccount.password == ''" />
            </q-card-actions>
        </q-card>
    </q-dialog>


    <q-dialog v-model="windowResetPsw">
        <q-card style="width: 400px; height: fit-content;">

            <q-card-section style="display: flex; justify-content: center;">
                <h5 style="margin: 0;">Hier können Sie ihr Passwort ändern:</h5>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*E-Mail" dense v-model="dataResetPassword.email" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Neues Passwort" dense v-model="dataResetPassword.newPsw" autofocus @keyup.enter="prompt = false" :type="dataResetPassword.displayNewPsw ? 'text' : 'password'">
                    <template v-slot:append>
                        <q-icon
                        :name="dataResetPassword.displayNewPsw ? 'visibility' : 'visibility_off'"
                        class="cursor-pointer"
                        @click="dataResetPassword.displayNewPsw = !dataResetPassword.displayNewPsw"
                        />
                    </template>
                </q-input>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Passwort bestätigen" dense v-model="dataResetPassword.submitNewPsw" autofocus @keyup.enter="prompt = false" :type="dataResetPassword.displaySubmitNewPsw ? 'text' : 'password'"><template v-slot:append>
                        <q-icon
                        :name="dataResetPassword.displaySubmitNewPsw ? 'visibility' : 'visibility_off'"
                        class="cursor-pointer"
                        @click="dataResetPassword.displaySubmitNewPsw = !dataResetPassword.displaySubmitNewPsw"
                        />
                    </template>
                </q-input>
            </q-card-section>

            <q-card-section class="q-pt-none" v-if="dataResetPassword.newPsw !== dataResetPassword.submitNewPsw">
                <a style="color: red;">Passwort muss bestätigt werden.</a>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input label="*Lieblingsreiseziel als Authentifikation" dense v-model="dataResetPassword.secQuest" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Abbrechen" v-close-popup />
                <q-btn flat label="Passwort ändern" v-close-popup :disabled="dataResetPassword.newPsw !== dataResetPassword.submitNewPsw || dataResetPassword.newPsw == ''" @click="resetPassword()"/>
            </q-card-actions>
        </q-card>
    </q-dialog>

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
        const dataCreateAccount = ref({
            email: "",
            name: "",
            surname: "",
            password: "",
            masterkey: "",
            secQuest: "",
            admin: ""
        })
        const passwordSub = ref("")
        const windowCreateAccount = ref(false)
        const showPassword = ref(false)
        const $q = useQuasar()
        const router = useRouter()
        const windowResetPsw = ref(false)
        const dataResetPassword = ref({
            email: "",  
            newPsw: "",
            submitNewPsw: "",
            secQuest: "",
            displayNewPsw: false,
            displaySubmitNewPsw: false,
        })


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

        function displayCreateAccount() {
            windowCreateAccount.value = true
        }

        function  isValidEmail(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-äöüÄÖÜ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        }

        async function createAccount() {

            const data = { ...dataCreateAccount.value }
            delete data.admin

            if(Object.values(data).some(value => value === "")){
                $q.notify({
                    message: "Bitte alle Felder ausfüllen.",
                    type: "negative",
                    timeout:2000
                })
                return;
            }
            if(!isValidEmail(dataCreateAccount.value.email)){
                $q.notify({
                    message: "Invalide E-Mail.",
                    type: "negative",
                    timeout:2000
                })
                return
            }
            try {
                await api.post('/api/createUser', dataCreateAccount.value)
                dataCreateAccount.value = {
                    email: "",
                    name: "",
                    surname: "",
                    password: "",
                    masterkey: "",
                    secQuest: "",
                    admin: ""
                }
                $q.notify({
                    message: "Ihr Account wurde erfolgreich angelegt.",
                    type: "positive",
                    timeout:2000
                })
            } catch(err) {
                if(err.status == 401) {
                    $q.notify({
                        message: "Invaliden Masterkey.",
                        type: "negative",
                        timeout:2000
                    })
                } else {
                    console.log(err)
                    $q.notify({
                        message: "Fehler beim erstellen.",
                        type: "negative",
                        timeout:2000
                    })
                }
            }
        }

        async function resetPassword(){
            try {

                await api.put('/api/changePassword', dataResetPassword.value)
                dataResetPassword.value = {
                    email: "", 
                    newPsw: "",
                    submitNewPsw: "",
                    secQuest: "",
                    displayOldPsw: false,
                    displayNewPsw: false,
                    displaySubmitNewPsw: false,
                }

                $q.notify({
                    message: "Passwort wurde erfolgreich geändert",
                    type: 'positive',
                    timeout: 2000
                })

            } catch(err) {
                console.log(err)
                $q.notify({
                    message: "Fehler beim Passwort zurücksetzen",
                    type: 'negative',
                    timeout: 2000
                })
            }
        }

        return {
            dataLogin,
            dataCreateAccount,
            windowCreateAccount,
            windowResetPsw,
            passwordSub,
            showPassword,
            dataResetPassword,
            Login,
            displayCreateAccount,
            createAccount,
            resetPassword
        }
    }
});
</script>


<style scoped>
.content {
    max-width: 500px;
    min-width: 370px;
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
    gap: 8px;
}

.input {
    min-width: 100px;
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