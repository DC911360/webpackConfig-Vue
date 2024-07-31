<template>
    <h1 class="title">hello vue</h1>

    <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
    </ul>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
    <router-view/>
</template>
<script>
    export default{
        name:"App",
    }
</script>
<style>
    .title{
        color: green;
    }
</style>