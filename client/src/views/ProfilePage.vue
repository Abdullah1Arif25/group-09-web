<template>
    <div class="profile-wrapper">
      <div class="profile-card">
  
        <h2 class="title">Profile Settings</h2>
  
        <!-- Choose button -->
        <div v-if="step === 1" class="form">
  
          <button class="confirm-btn" @click="selectAction('password')">
            Change Password
          </button>
  
          <button class="confirm-btn" @click="selectAction('language')">
            Change Language
          </button>
  
        </div>
  
        <!-- VEerify user -->
        <form v-if="step === 2" class="form" @submit.prevent="verifyUser">
  
          <div class="input-group">
            <label>UserID</label>
            <input v-model="userId" type="text" required />
          </div>
  
          <div class="input-group">
            <label>Personal Number</label>
            <input v-model="personalNumber" type="text" maxlength="10" required />
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
  
          <button class="confirm-btn">Confirm</button>
        </form>
  
        <!-- Update password -->
        <form v-if="step === 3 && action === 'password'" class="form"
          @submit.prevent="updatePassword">
  
          <div class="input-group">
            <label>New Password</label>
            <input v-model="newPassword" type="password" maxlength="8" required />
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
  
          <button class="confirm-btn">Update Password</button>
        </form>
  
        <!-- Update language -->
        <form v-if="step === 3 && action === 'language'" class="form"
          @submit.prevent="updateLanguage">
  
          <div class="input-group">
            <label>New Language</label>
            <input v-model="newLanguage" type="text" required />
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
  
          <button class="confirm-btn">Update Language</button>
        </form>
  
      </div>
    </div>
  </template>
  
  
  <script>
import { Api } from "@/Api";

export default {
  name: "ProfilePage",

  data() {
    return {
      step: 1,
      action: "",
      userId: "",
      personalNumber: "",
      newPassword: "",
      newLanguage: "",
      error: "",
      success: "",
    };
  },

  methods: {
    selectAction(type) {
      this.action = type;
      this.step = 2;
    },

    async verifyUser() {
      this.error = "";

      try {
        const res = await Api.get(`/users/${this.userId}`);

        if (!res.data || !res.data.personalNumber) {
          this.error = "User not found.";
          return;
        }

        if (res.data.personalNumber !== this.personalNumber) {
          this.error = "Incorrect personal number.";
          return;
        }

        this.step = 3;

      } catch (err) {
        this.error = err.response?.data?.message || "Verification failed.";
      }
    },

    async updatePassword() {
      this.error = "";
      this.success = "";

      try {
        await Api.patch(`/users/${this.userId}`, {
          password: this.newPassword,
        });

        this.success = "Password updated successfully! Redirecting...";

        setTimeout(() => {
          this.$router.push("/main");
        }, 2000);

      } catch (err) {
        this.error = err.response?.data?.message || "Update failed.";
      }
    },

    async updateLanguage() {
      this.error = "";
      this.success = "";

      try {
        await Api.patch(`/users/${this.userId}`, {
          language: this.newLanguage,
        });

        this.success = "Language updated successfully! Redirecting...";

        setTimeout(() => {
          this.$router.push("/main");
        }, 2000);

      } catch (err) {
        this.error = err.response?.data?.message || "Update failed.";
      }
    }
  },
};
  </script>
  
  <style>
.profile-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #2b0d2b, #6d2a46);
}


.profile-card {
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

.confirm-btn {
  width: 70%;
  margin: 25px auto 0 auto;
  padding: 15px 0;
  border: none;
  border-radius: 50px;
  background: #f8f6f7;
  color: #3a0f2a;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.confirm-btn:hover {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.32),
    #a77b99
  );
}

.error {
  color: #ffb4b4;
  font-size: 16px;
}

.success {
  color: #3a0f2a;;
  font-size: 16px;
}

.setting-btn {
  width: 100%;
  padding: 18px 0;
  border-radius: 50px;
  background: #f8f6f7;
  color: #3a0f2a;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: 0.25s ease;
  margin-bottom: 25px;
}

.setting-btn:hover {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.32),
    #a77b99
  );
}
</style>

  