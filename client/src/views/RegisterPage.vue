<template>
  <div class="register">
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
        <div class="select-wrapper">
          <select v-model="language" required>
            <option disabled value="">Select language</option>
            <option
              v-for="lang in languages"
              :key="lang.code"
              :value="lang.code">
              {{ lang.label }}
            </option>
          </select>
        </div>
      </div>


        <div class="input-group">
          <label>Password:</label>
          <input v-model="password" type="password" placeholder="Enter Password" />
        </div>

        <button type="submit" class="btn-submit">Register</button>

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
    languages: [
      { label: "Swedish", code: "swe" },
      { label: "English", code: "eng" },
      { label: "Arabic", code: "ara" },
      { label: "Spanish", code: "spa" },
      { label: "French", code: "fra" },
      { label: "German", code: "deu" },
      { label: "Italian", code: "ita" },
      { label: "Portuguese", code: "por" },
      { label: "Russian", code: "rus" },
      { label: "Chinese (Mandarin)", code: "zho" },
      { label: "Japanese", code: "jpn" },
      { label: "Korean", code: "kor" },
      { label: "Hindi", code: "hin" },
      { label: "Turkish", code: "tur" },
      { label: "Persian", code: "fas" },
      { label: "Somali", code: "som" }
    ]
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

        const { message } = err.response.data;
        this.error = message;
        alert(this.error);
      }
    }
  }
};
</script>
<style scoped>

/* Background */
.register {
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
  font-family: "Noto Serif Ethiopic", serif;
  font-size: 42px;
  font-weight: 700;
  margin-top: -10px; 
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 105%;
  margin: 0 auto;
  margin-bottom: 20px;
  text-align: left;  
}

select {
  width: 100%;
  padding: 15px;
  border-radius: 50px;
  border: none;
  background: #fadde8;
  color: #2b0d2b;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #6d2a46;
  pointer-events: none;
  font-size: 16px;
}


label {
  font-weight: 400;
  font-size: 1rem;
  color: #2b0d2b; 
  margin-bottom: 6px;
}

/* Input feild */
input {
  width: 100%;
  padding: 15px;
  border-radius: 50px !important;
  border: none;
  background: #fadde8;
  color: #2b0d2b;
  font-size: 15px;
  text-align: left;
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
  margin-bottom: 10px;
  color: white;
  cursor: pointer;
  transition: 0.25s ease;
}

.btn-submit:hover {
  opacity: 0.8;
}

.login-text a {
  color: #59213e;
  text-decoration: underline;
  font-weight: 600;
  transition: 0.25s ease;
}
</style>
