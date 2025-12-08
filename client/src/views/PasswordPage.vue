<template>
    <div class="login-wrapper">
      <div class="login-card">
  
        <h2 class="title">Update Password</h2>
  
        <!-- Verify user -->
        <form @submit.prevent="verifyUser" class="form" v-if="!verified">
          
          <div class="input-group">
            <label>UserID</label>
            <input v-model="userId" type="text" required />
          </div>
  
          <div class="input-group">
            <label>Personal Number</label>
            <input v-model="personalNumber" type="text" maxlength="10" required />
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
  
          <button type="submit" class="login-btn">Confirm</button>
        </form>
  
        <!-- Enter new password -->
        <form @submit.prevent="updatePassword" class="form" v-else>
          <div class="input-group">
            <label>New Password</label>
            <input v-model="newPassword" type="password" maxlength="8" required />
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
  
          <button type="submit" class="login-btn">Update</button>
        </form>
  
      </div>
    </div>
  </template>
  
  <script>
  import { Api } from "@/Api";
  
  export default {
    name: "PasswordPage",
  
    data() {
      return {
        userId: "",
        personalNumber: "",
        newPassword: "",
        verified: false,
        error: "",
        success: "",
      };
    },
  
    methods: {
      // Verify user using GET /users/:userId
      async verifyUser() {
        this.error = "";
  
        try {
          const res = await Api.get(`/users/${this.userId}`);
  
          if (!res.data || !res.data.personalNumber) {
            this.error = "User not found.";
            return;
          }
  
          // Compare personal number
          if (res.data.personalNumber !== this.personalNumber) {
            this.error = "Personal number is incorrect.";
            return;
          }
  
          this.verified = true;
  
        } catch (err) {
          this.error = err.response?.data?.message || "Verification failed.";
        }
      },
  
      // Update password using PATCH /users/:userId
      async updatePassword() {
        this.error = "";
        this.success = "";
  
        try {
          await Api.patch(`/users/${this.userId}`, {
            password: this.newPassword,
          });
  
          this.success = "Password updated successfully!";
        } catch (err) {
          this.error = err.response?.data?.message || "Update failed.";
        }
      },
    },
  };
  </script>
  
  <style>

  .login-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, #2b0d2b, #6d2a46);
  }
  
  .login-card {
    width: 480px;
    padding: 55px 50px;
    border-radius: 45px;
    background: linear-gradient(90deg, rgba(255, 194, 194, 0.18), #936480);
    backdrop-filter: blur(12px);
    text-align: center;
    color: white;
  }
  
  .title {
    font-family: "Noto Serif Ethiopic", serif;
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 50px;
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
  
  .input-group input {
    width: 100%;
    height: 50px;
    border-radius: 100px !important;
    padding: 0 20px;
    border: none;
    background: linear-gradient(90deg, #2b0d2b, #6d2a46);
    color: white;
  }
  
  .login-btn {
    width: 70%;
    margin: 25px auto 0 auto;
    padding: 15px 0;
    border-radius: 50px;
    background: #f8f6f7;
    color: #3a0f2a;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
  }
  
  .login-btn:hover {
    background: linear-gradient(90deg, rgba(255, 194, 194, 0.32), #a77b99);
  }
  
  .error {
    color: #ffb4b4;
    font-size: 16px;
  }
  
  .success {
    color: #bbf7ce;
    font-size: 16px;
  }
  </style>
  