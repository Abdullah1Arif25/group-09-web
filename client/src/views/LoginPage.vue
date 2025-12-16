<template>
    <div class="login-wrapper">
      <div class="login-card">

        <!-- Header -->
        <h2 class="title">Welcome Back</h2>
        <p class="subtitle">Sign in</p>
  
        <form @submit.prevent="handleLogin" class="form">

        <!-- Inputs -->
          <!-- Toggle between UserID or Personal Number -->
            <div class="login-toggle">
              <span 
                :class="['toggle-option', loginMethod === 'userId' ? 'active' : '']" 
                @click="loginMethod = 'userId'">UserID</span>
            
              <span class="divider">/</span>
            
              <span 
                :class="['toggle-option', loginMethod === 'personalNumber' ? 'active' : '']"
                @click="loginMethod = 'personalNumber'">Personal number</span>
            </div>

            <!-- Dynamic Input -->
            <div class="input-group">
              <label>{{ loginMethod === 'userId' ? 'UserID' : 'Personal Number' }}</label>
              <input 
                :placeholder="loginMethod === 'userId' ? ' ' : ' '" 
                v-model="loginInput"
                type="text"
                required/>
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
        loginMethod: "userId", 
        loginInput: "",
        password: "",
        error: "",
      };
    },
  
    methods: {
      async handleLogin() {
      this.error = "";

      try {
        const payload = {
          password: this.password,
        };

        if (this.loginMethod === "userId") {
          payload.userId = this.loginInput;
        } else {
          payload.personalNumber = this.loginInput;
        }

        const response = await Api.post("/users/login", payload);

        setUserObjectId(response.data.ObjectId);
        // localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        this.$router.push("/main");
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed";
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
  padding: 20px;
}


.login-card {
  width: 100%;
  max-width: 480px;
  padding: 45px;
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

.title {
  font-family: "Noto Serif Ethiopic", serif;
  font-size: clamp(28px, 6vw, 42px);
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 1px;
}


.subtitle {
  font-size: clamp(14px, 3.5vw, 18px);
  margin-bottom: 35px;
  color: #ead6e3;
}


.form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}


.login-toggle {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  font-size: 15px;
  margin-top: -10px;
}

.toggle-option {
  cursor: pointer;
  color: #ead6e3;
  transition: 0.2s ease;
}

.toggle-option.active {
  color: white;
  font-weight: 700;
  text-decoration: underline;
}

.divider {
  color: rgba(255,255,255,0.6);
}


.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.input-group label {
  font-size: 15px;
  margin-bottom: 8px;
  color: #f8e7f2;
}

.input-group input {
  width: 100%;
  height: 50px;
  border-radius: 100px;
  padding: 0 20px;
  border: none;
  outline: none;
  background: linear-gradient(90deg, #2b0d2b, #6d2a46);
  color: white;
  font-size: 15px;
}


.forgot-password-link {
  margin-top: -18px;
  font-size: 14px;
  color: #ead6e3;
  text-align: left;
  text-decoration: underline;
}


.login-btn {
  width: 100%;
  max-width: 260px;
  margin: 20px auto 0;
  padding: 14px 0;
  border: none;
  border-radius: 50px;
  background: #F8F6F7;
  color: #3a0f2a;
  font-size: 18px;
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
  margin-top: 25px;
  font-size: 15px;
}

.register-link a {
  color: white;
  font-weight: 600;
  text-decoration: underline;
}

/* This is for small screens */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
    border-radius: 32px;
  }

  .form {
    gap: 24px;
  }
}

/* This is for landscape mode */
@media (max-height: 500px) {
  .login-wrapper {
    align-items: flex-start;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .login-card {
    margin: 0 auto;
  }
}



  </style>
  