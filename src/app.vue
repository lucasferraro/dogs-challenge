<template>
  <div class="container">
    <nav class="navbar navbar-light bg-light mb-3">
      <span class="navbar-brand mb-0 h1 mr-auto">Dog Team Challenge</span>
      <router-link class="btn btn-info" :to="{name: 'my-team'}" >
        <span>My Team</span>
      </router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
