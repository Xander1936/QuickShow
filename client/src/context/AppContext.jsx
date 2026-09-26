// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { useAuth, useUser } from '@clerk/react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(null)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user, isLoaded} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async () => {
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: 
            {Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error)
            setIsAdmin(false)
        }
    }

    // Function to fetch the shows
    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if (data.success) {
                setFavoriteMovies(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchShows()
    },[])

    useEffect(() => {
        if(user) {
            fetchIsAdmin()
            fetchFavoriteMovies()
        } else {
            setIsAdmin(null)
        }
    },[user]) // When the user changes in the dependency array, the fetchIsAdmin() function is called


    const value = {
        axios,
        fetchIsAdmin,
        user, isLoaded, getToken, navigate, isAdmin, shows,
        favoriteMovies, fetchFavoriteMovies, image_base_url
    }

    return (
        <AppContext.Provider value={value} >
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)