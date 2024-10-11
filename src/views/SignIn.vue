<template>
    <h1>Sign in Account</h1>
    <div>
        <form @submit.prevent="register">
            <!-- <FloatLabel variant="on">
                <InputText id="on_label" v-model="username" />
                <label for="on_label">Username</label>
            </FloatLabel> -->
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="email" />
                <label for="on_label">Email</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="password" />
                <label for="on_label">Password</label>
            </FloatLabel>
        </form>
        <Button label="Submit" @click="register" />
        <Button label="Sign in with Google" @click="signInWithGoogle"/>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';

import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

const register = () => {
    if (email.value === '' || password.value === '') {
        alert('Please enter both email and password');
        return;
    }

    // alert(`Registering with: ${email.value} ${password.value}`);
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // alert(`User signed in: ${user.email}`);
            router.push('/1');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorCode} ${errorMessage}`);
        })
}

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        console.log(result.user);
        router.push('/1');
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}


</script>

<style scoped>
div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 30px;
    gap: 10px;
}
input{
    border-radius: 5px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>