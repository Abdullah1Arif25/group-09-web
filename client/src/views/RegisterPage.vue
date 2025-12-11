<template>
  <div class="register-wrapper">
    <div class="register-card">

      <h1 class="title">Sign up</h1>

      <form @submit.prevent="handleRegister">

        <div class="input-group">
          <label>Username:</label>
          <input v-model="userId" placeholder="Enter Username" />
        </div>

        <div class="input-group">
          <label>Personal Number:</label>
          <input v-model="personalNumber" placeholder="Enter Personal Number" />
        </div>

        <div class="input-group">
          <label>Language:</label>
          <input v-model="language" placeholder="Enter Language" />
        </div>

        <div class="input-group">
          <label>Password:</label>
          <input v-model="password" type="password" placeholder="Enter Password" />
        </div>

        <button type="submit" class="btn-submit">REGISTER</button>

        <p class="login-text">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>

      </form>
    </div>
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
      try {
        await Api.post("/users/register", {
          userId: this.userId,
          personalNumber: this.personalNumber,
          language: this.language,
          password: this.password
        });

        this.$router.push("/login");
      } catch (err) {
        console.log(err.response?.data);
      }
    }
  }
};
</script>

<style scoped>
/* Background */
.register-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    90deg, 
    #2b0d2b, 
    #6d2a46);
}

.register-card {
  width: 480px;
  padding: 40px 50px;
  border-radius: 45px;
  background: linear-gradient(
    90deg, 
    rgba(255, 194, 194, 0.18),
     #936480);
  backdrop-filter: blur(12px);
  text-align: center;
  color: white;
}

.title {
  font-size: 42px;
  font-weight: 700;
  margin-top: -10px; 
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 0 auto;
  margin-bottom: 20px;
  text-align: left;  
}

label {
  font-weight: 600;
  font-size: 1rem;
  background: linear-gradient(90deg, #2b0d2b, #300919);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

/* Input feild */
input {
  width: 100%;
  padding: 16px;
  border-radius: 50px !important;
  border: none;
  background: #f8f6f7;
  color: #2b0d2b;
  font-size: 16px;
  text-align: center;
  outline: none;
  box-sizing: border-box;
}

input::placeholder {
  color: #6d2a46;
  opacity: 0;
  transition: 0.2s ease;
}

input:focus::placeholder {
  opacity: 0.7;
}

/* Register button */
.btn-submit {
  width: 70%;
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(
    90deg, 
    #2b0d2b,
    #6d2a46);
  font-size: 20px;
  font-weight: 700;
  color: white !important;
  cursor: pointer;
  transition: 0.25s ease;
}

.register-card a {
  color: #59213e !important;
  text-decoration: underline;
  font-weight: 600;
  transition: 0.25s ease;
}

.register-card a:hover {
  opacity: 0.8;
}
</style>

