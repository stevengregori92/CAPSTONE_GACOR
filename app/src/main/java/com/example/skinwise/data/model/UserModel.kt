package com.example.skinwise.data.model

data class UserModel(

    val token: String,
    val isLogin: Boolean,
    var nama: String,
    var email: String,
    val photoUrl: String,
    val role: String,
    val subscriber: Boolean
)
