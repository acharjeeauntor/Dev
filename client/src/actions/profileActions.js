import axios from 'axios'

import { GET_ERRORS, GET_PROFILE, PROFILE_LOADING,CLEAR_CURRENT_PROFILE,SET_CURRENT_USER, GET_PROFILES } from './types'


//Get current Profile
export const getCurrentProfile = () => dispatch => {
     dispatch(setProfileLoading())
     axios.get('/api/profile')
          .then(res => dispatch({
          type: GET_PROFILE,
         payload:res.data      
     }))
     .catch(err=>dispatch({
          type: GET_PROFILE,
         payload:{}     
     }))
}

//Get  Profile by handle
export const getProfileByHandle = (handle) => dispatch => {
     dispatch(setProfileLoading())
     axios.get(`/api/profile/handle/${handle}`)
          .then(res => dispatch({
          type: GET_PROFILE,
         payload:res.data      
     }))
     .catch(err=>dispatch({
          type: GET_PROFILE,
         payload:null  
     }))
}

//Create Profile

export const createProfile = (profileData,history) => dispatch => {
     axios.post('/api/profile', profileData)
          .then(res=>history.push('/dashboard'))
          .catch(err => dispatch({
               type: GET_ERRORS,
               payload:err.response.data
     }))
}

//add Experience
export const addExperience = (expData,history) => dispatch => {
     axios.post('/api/profile/experience', expData)
          .then(res=>history.push('/dashboard'))
          .catch(err => dispatch({
               type: GET_ERRORS,
               payload:err.response.data
     }))
}

//Delete Experience
export const deleteExperience = (id) => dispatch => {
     axios.delete(`/api/profile/experience/${id}`)
          .then(res => dispatch({
               type: GET_PROFILE,
               payload:res.data
          }))
          .catch(err => dispatch({
               type: GET_ERRORS,
               payload:err.response.data
     }))
}

//add Education
export const addEducation = (eduData,history) => dispatch => {
     axios.post('/api/profile/education', eduData)
          .then(res=>history.push('/dashboard'))
          .catch(err => dispatch({
               type: GET_ERRORS,
               payload:err.response.data
     }))
}

//Delete Education
export const deleteEducation = (id) => dispatch => {
     axios.delete(`/api/profile/education/${id}`)
          .then(res => dispatch({
               type: GET_PROFILE,
               payload:res.data
          }))
          .catch(err => dispatch({
               type: GET_ERRORS,
               payload:err.response.data
     }))
}

//Delete User & Profile
export const deleteAccount = () => dispatch => {
     if (window.confirm('Are You sure? This can might make a big change')) {
          axios.delete('/api/profile')
               .then(res => dispatch({
                    type: SET_CURRENT_USER,
                    payload:{}
               }))
               .catch(err => dispatch({
                    type: GET_ERRORS,
                    payload:err.response.data
          }))
     }
}


//Get All Profile
export const getProfiles = () => dispatch => {
     dispatch(setProfileLoading())
          axios.get('/api/profile/all')
               .then(res => dispatch({
                    type: GET_PROFILES,
                    payload:res.data
               }))
               .catch(err => dispatch({
                    type: GET_PROFILES,
                    payload:null
          }))
     
}


// Profile Loading
export const setProfileLoading = () => {
     return {
          type:PROFILE_LOADING
     }
}

// Clear Profile 
export const clearCurrentProfile = () => {
     return {
          type:CLEAR_CURRENT_PROFILE
     }
}