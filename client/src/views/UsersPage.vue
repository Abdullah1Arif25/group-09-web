<template>
  <div class="users">
    <div class="usersCard">

      <div class="topBar">
        <button class="backButton" @click="$router.push('/admin')">
          ← Back
        </button>
      </div>

      <h1 class="title">Registered Users</h1>

  <div v-if="users.length" class="content">
  <ul class="usersList">
    <li v-for="user in users" :key="user._id">
      <span>{{ user.userId }}</span>
      <span>{{ user.language }}</span>
    </li>
  </ul>
</div>

    </div>
  </div>
</template>

<script>
import { Api } from "@/Api";

export default {
  name: "AdminUsersPage",

  data() {
    return {
      users: []
    };
  },
  async mounted() {
    await this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        const res = await Api.get("/users");
        this.users = res.data;
      } catch (err) {
        alert("Failed to load users");
      }
    }
  }
};
</script>

<style scoped>
.users {
  min-height: 100vh;
  background: linear-gradient(90deg, #2b0d2b, #6d2a46);
  display: flex;
  justify-content: center;
  align-items: center;
}

.usersCard {
  width: 100%;
  max-width: 500px;
  min-height: 300px;
  padding: 32px 26px;
  border-radius: 40px;
  background: linear-gradient(90deg,rgba(255, 194, 194, 0.18), #936480);
  color: white;
}

.topBar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
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

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
}

.usersList {
  padding: 0;
  margin: 0;
}

.usersList li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  display: flex;
  justify-content: space-between;
}

.content {
  overflow-y: visible;
}

@media (max-height: 700px) {
  .usersCard {
    max-height: 90vh;
  }

  .content {
    overflow-y: auto;
  }
}

</style>
