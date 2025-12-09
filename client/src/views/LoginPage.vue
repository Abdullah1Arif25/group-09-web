<template>
    <div class="login-wrapper">
      <div class="login-card">

        <!-- Header -->
        <h2 class="title">Welcome Back</h2>
        <p class="subtitle">Sign in</p>
  
        <form @submit.prevent="handleLogin" class="form">

        <!-- Inputs -->
          <div class="input-group">
            <label>UserID</label>
            <input v-model="userId" type="text" required />
          </div>
  
          <div class="input-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
          
          <router-link class="forgot-password-link" to="/password">Forgot Password!</router-link>
  
          <button type="submit" class="login-btn">Login</button>
        </form>

        <!-- Error handling -->
        <p v-if="error" class="error">{{ error }}</p>
  
        <p class="register-link">
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
  
      </div>
    </div>
  </template>
  
  <script>
  import { Api } from "../Api";
    import { getUserObjectId, setUserObjectId } from "@/cache/user.cache";
  
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
          const response = await Api.post("/users/login", {
            userId: this.userId,
            password: this.password,
          });
          setUserObjectId(response.data.ObjectId);
  
          localStorage.setItem("token", response.data.token);
          this.$router.push("/main");
  
        } catch (err) {
          this.error = err.response?.data?.error || "Login failed";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Gradient background */
  .login-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, #2b0d2b, #6d2a46);
    margin: 0;
  }
  

  .login-card {
    width: 480px;
    padding: 55px 50px;
    border-radius: 45px;
    background: linear-gradient(
      90deg,
      rgba(255, 194, 194, 0.18),
      #936480
    );
    backdrop-filter: blur(12px);
    text-align: center;
    color: white;
  }
  
  /* Title */
  .title {
    font-family: "Noto Serif Ethiopic", serif;
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }
  
  /* Subtitle */
  .subtitle {
    font-size: 18px;
    margin-bottom: 40px;
    color: #ead6e3;
  }
  

  .form {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  

  .input-group label {
    font-size: 16px;
    margin-bottom: 8px;
    color: #f8e7f2;
  }
  
  /* Input fields */
  .input-group input {
    width: 100%;
    height: 50px;
    border-radius: 100px !important;
    overflow: hidden;
    padding: 0 20px;
    border: none;
    outline: none;
    background: linear-gradient(90deg, #2b0d2b, #6d2a46);
    display: flex;
    align-items: center;
    color: white;
    font-size: 16px;
  }
  
  /* Login button */
  .login-btn {
    width: 70%;
    margin: 25px auto 0 auto;
    padding: 15px 0;
    border: none;
    border-radius: 50px;
    background: #F8F6F7;
    color: #3a0f2a;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
  }
  

  .login-btn:hover {
    background: linear-gradient(
      90deg,
      rgba(255, 194, 194, 0.32),
      #a77b99
    );
  }
  

  .register-link {
    margin-top: 30px;
    font-size: 16px;
  }
  
  .register-link a {
    color: white;
    font-weight: 600;
    text-decoration: underline;
  }

  .forgot-password-link {
  display: block;
  margin: -25px 0 10px 0;   
  font-size: 16px;
  color: #ead6e3;          
  text-align: left;        
  text-decoration: none;   
  cursor: pointer;
  transition: 0.2s ease;
  text-decoration: underline;
}

.forgot-password-link:hover {
  color: #ffffff;
}

  </style>
  