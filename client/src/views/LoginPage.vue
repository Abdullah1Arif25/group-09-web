<template>
    <div class="login-container">
      <h2>Login</h2>
  
      <form @submit.prevent="handleLogin">
        <div>
          <label>User ID</label>
          <input v-model="userId" type="text" required />
        </div>
  
        <div>
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
  
        <button type="submit">Login</button>
      </form>
  
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { Api } from "../Api";
  
  export default {
    name: "LoginPage",
  
    data() {
      return {
        userId: "",
        password: "",
        error: "",
      };
    },
  
    methods: {
      async handleLogin() {
        this.error = "";
  
        try {
          const response = await Api.post("/auth/login", {
            userId: this.userId,
            password: this.password,
          });
  
          console.log(response.data);
  
          // Store token or whatever backend sends
          localStorage.setItem("token", response.data.token);
  
          // redirect
          this.$router.push("/home");
        } catch (err) {
          this.error = err.response?.data?.error || "Login failed";
        }
      },
    },
  };
  </script>
  
  <style>
  .login-container {
    max-width: 350px;
    margin: 60px auto;
    text-align: center;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  