<template>
  <div class="register-container">
    <center><h1>Register</h1></center>

    <form @submit.prevent="handleRegister">

      <div>
        <label>User ID:</label>
        <input v-model="userId" placeholder="User ID">
      </div>

      <div>
        <label>Personal Number:</label>
        <input v-model="personalNumber" placeholder="Personal Number">
      </div>

      <div>
        <label>Language:</label>
        <input v-model="language" placeholder="Language">
      </div>

      <div>
        <label>Password:</label>
        <input v-model="password" type="password" placeholder="Password">
      </div>

      <button type="submit">Register</button>
      <button type="button" @click="$router.push('/')">Back to Home</button>

      <p v-if="error" class="error">{{ error }}</p>

    </form>
  </div>
</template>
<script>
import { Api } from "../Api";

export default {
  name: "RegisterPage",

  data() {
    return {
      userId: "",
      personalNumber: "",
      language: "",
      password: "",
      error: "",
    };
  },

  methods: {
    async handleRegister() {
      this.error = "";

      try {
        const response = await Api.post("/auth/register", {
          userId: this.userId,
          personalNumber: this.personalNumber,
          language: this.language,
          password: this.password
        });

        console.log(response.data);

        this.$router.push("/login");

      } catch (err) {
        this.error = err.response?.data?.message || "Registration failed";
      }
    }
  }
};
</script>

<style>
.register-container {
  max-width: 350px;
  margin: 60px auto;
  text-align: center;
}

.error {
  color: red;
  margin-top: 10px;
}

button {
  margin-top: 10px;
}
</style>