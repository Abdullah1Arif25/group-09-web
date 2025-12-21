<template>
  <div class="page-container">
    <div class="card">

        <div class="topBar">
        <button class="backButton" @click="$router.push('/admin')">
          ← Back
        </button>
      </div>

      <h1 class="title">Create Topic Room</h1>

      <!-- Room Type -->
      <div class="input-group">
        <label>Room Type</label>
        <select v-model="branchingRoomType" class="field">
          <option disabled value="">Select room type</option>
          <option
            v-for="type in roomTypes"
            :key="type"
            :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- Room Topic -->
      <div class="input-group">
        <label>Room Topic</label>
        <select v-model="roomTopic" class="field">
          <option disabled value="">Select topic</option>
          <option
            v-for="topic in roomTopics"
            :key="topic"
            :value="topic">
            {{ topic }}
          </option>
        </select>
      </div>

      <!-- Room ID -->
      <div class="input-group">
        <label>Room ID</label>
        <input
          v-model="branchingRoomId"
          class="field"
          placeholder="Enter room ID"
        />
      </div>

      <!-- Button -->
      <button
        class="btn-submit"
        @click="handleCreateRoom">
        Create Room
      </button>

    </div>
  </div>
</template>

<script>
import { Api } from "../Api";

export default {
  name: "CreateRooms",

  data() {
    return {
      branchingRoomId: "",
      branchingRoomType: "",
      roomTopic: "",
      error: "",

      roomTypes: ["LocalRoom", "GlobalRoom"],

      roomTopics: [
        "General",
        "Scandle",
        "Relationships",
        "Travel",
        "Movies",
        "Books",
        "Sports",
        "Food",
        "School"
      ]
    };
  },

  methods: {
    async handleCreateRoom() {
      try {
        if (!this.branchingRoomId || !this.branchingRoomType || !this.roomTopic) {
          alert("Please fill in all fields");
          return;
        }

        await Api.post("/branchingRooms", {
          branchingRoomId: this.branchingRoomId,
          branchingRoomType: this.branchingRoomType,
          roomTopic: this.roomTopic
        });

        alert("Branching room created successfully!");
        this.$router.push("/admin");
      } catch (err) {
        alert(err);
      }
    }
  }
};
</script>

<style scoped>

.page-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    90deg,
    #2b0d2b,
    #6d2a46
  );
}

.card {
  width: 480px;
  padding: 40px 50px;
  border-radius: 40px;
  background: linear-gradient(135deg,rgba(255, 194, 194, 0.18),#936480);
  backdrop-filter: blur(12px);
  text-align: center;
}

.topBar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.title {
  font-family: "Noto Serif Ethiopic", serif;
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 18px;
  color: white;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 22px;
}

label {
  color: #2b0d2b;
  margin-bottom: 8px;
  font-size: 15px;
  text-align: left;
}

.backButton {
  background: #f6e3ea;
  color: #6d2a46;
  border: none;
  border-radius: 20px;
  padding: 6px 18px;
  font-weight: 600;
  cursor: pointer;
}

.field {
  width: 100%;
  height: 56px;
  padding: 0 22px;
  border-radius: 999px !important;
  border: none;
  background: #fadde8;
  color: #2b0d2b;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  appearance: none;
}

.btn-submit {
  width: 70%;
  height: 50px;
  margin-top: 25px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(90deg,#2b0d2b,#6d2a46);
  font-size: 18px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  display: block; 
  margin: 30px auto 0; 
}

.btn-submit:hover {
  opacity: 0.85;
}
</style>