package com.example.skinwise.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.example.skinwise.data.Repository
import com.example.skinwise.data.model.loginModel
import com.example.skinwise.data.pref.UserModel
import kotlinx.coroutines.launch

class MainViewModel (private val repository: Repository) : ViewModel() {
    private val _isLoading = MutableLiveData<Boolean>()

    private val _message = MutableLiveData<String>()
    val message: LiveData<String> get() = _message

    fun getSession(): LiveData<loginModel> {
        return repository.getSession().asLiveData()
    }

    fun logout() {
        viewModelScope.launch {
            repository.logout()
        }
    }
}