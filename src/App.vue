<template>
<div id="app">
    <router-view></router-view>
</div>
</template>

<script>
export default {
    name: 'App',
    components: {}
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
    font-display: swap;
}

::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, .1);
    border-radius: 0;
}

::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 0px;
    height: 0px;
    cursor: pointer;
}

::-webkit-scrollbar-thumb {
    cursor: pointer;
    border-radius: 5px;
    background: rgba(0, 0, 0, .25);
    transition: color .2s ease;
}
</style>
