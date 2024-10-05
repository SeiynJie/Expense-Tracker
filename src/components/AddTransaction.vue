<template>
    <!-- <h3>Add new transactions</h3> -->
    <form id="form" @submit.prevent="onSubmit">
        <!-- <div class="form-control">
            <label for="text">Transaction name</label>
            <input type="text" id="text" v-model="text" placeholder="Enter text..." />
        </div>
        <div class="form-control">
            <label for="amount">Amount</label>
            <input type="text" id="amount" v-model="amount" placeholder="Enter amount..." />
        </div> -->
        <button class="btn">Add transaction</button>
    </form>

</template>

<script setup>
    import { ref } from "vue";
    import { useToast } from "vue-toastification";

    const text = ref("");
    const projectedCost = ref("0");
    const actualCost = ref("0");

    const emit = defineEmits(['transactionSubmitted'])

    const toast = useToast();
    const onSubmit = () => {
        // if (!text.value || !amount.value) {
        //     toast.error("Both fields must be filled")
        //     return;
        // }

        // console.log(text.value, amount.value);
        const transactionData = {
            id: Math.floor(Math.random() * 1000000),
            text: text.value,
            projectedCost: parseFloat(projectedCost.value),
            actualCost: parseFloat(actualCost.value)
        }

        emit('transactionSubmitted', transactionData)

        text.value = "";
        projectedCost.value = "0";
        actualCost.value = "0";
    }
</script>

<style scoped>
label {
    display: flex;
    margin-left: 5px;
}

form {
    display: flex;
    justify-content: space-between;
}

</style>