import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, LogOut, Mail, Calendar, Hash, Save, Edit2, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        dob: '',
        gender: 'Not Specified',
        profilePicture: null
    });

    // Store the last confirmed server state to revert to on Cancel
    const [lastSavedData, setLastSavedData] = useState(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        console.log("Fetching profile for User ID:", user.id);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
                alert('Error fetching profile: ' + error.message);
            }

            console.log("Fetched profile data:", data);

            if (data) {
                const mappedData = {
                    name: data.name || '',
                    email: user.email, // Always use auth email
                    dob: data.dob || '',
                    gender: data.gender || 'Not Specified',
                    profilePicture: data.profile_picture || null
                };
                setProfileData(mappedData);
                setLastSavedData(mappedData);
            } else {
                console.warn("No profile row found for user.");
                // Determine defaults if no profile exists
                const defaultData = {
                    name: user.email.split('@')[0],
                    email: user.email,
                    dob: '',
                    gender: 'Not Specified',
                    profilePicture: null
                };
                setProfileData(defaultData);
                setLastSavedData(defaultData);
            }
        } catch (err) {
            console.error("Unexpected error in fetchProfile:", err);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSave = async () => {
        console.log("Saving profile for User ID:", user.id);
        try {
            const updates = {
                name: profileData.name,
                dob: profileData.dob || null,
                gender: profileData.gender,
                profile_picture: profileData.profilePicture,
            };

            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) {
                console.error("Supabase update error:", error);
                alert("Error updating profile: " + error.message);
                return;
            }

            console.log("Supabase update data:", data);

            if (data) {
                const mappedData = {
                    name: data.name,
                    email: user.email,
                    dob: data.dob || '',
                    gender: data.gender || 'Not Specified',
                    profilePicture: data.profile_picture
                };
                setProfileData(mappedData);
                setLastSavedData(mappedData);
                setIsEditing(false);
            } else {
                console.warn("Update operation returned no data. Profile row might be missing.");
                alert("Profile row not found. Cannot update.");
            }
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Failed to save changes: " + error.message);
        }
    };

    const handleCancel = () => {
        if (lastSavedData) {
            setProfileData(lastSavedData);
        }
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-zinc-100">My Profile</h1>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl shadow-sm border border-zinc-700 overflow-hidden">
                <div className="h-32 bg-primary-600/20 relative border-b border-zinc-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-primary-600/50" />
                    <div className="absolute -bottom-12 left-8">
                        <div
                            className={`w-24 h-24 bg-zinc-800 rounded-2xl p-1 shadow-xl border border-zinc-700 relative group ${isEditing ? 'cursor-pointer' : ''}`}
                            onClick={triggerFileInput}
                        >
                            <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 overflow-hidden">
                                {profileData.profilePicture ? (
                                    <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} />
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-16 pb-8 px-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-zinc-100">{profileData.name || 'Guest User'}</h2>
                        <p className="text-zinc-500"></p>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
                            <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-zinc-900 border-zinc-600 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20' : 'bg-zinc-800/50 border-zinc-700'}`}>
                                <User className="text-zinc-500" size={20} />
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    disabled={!isEditing}
                                    className="bg-transparent w-full outline-none text-zinc-200 placeholder-zinc-600 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Email Address <span className="text-xs text-rose-500 ml-2">(Read-only)</span></label>
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-700 bg-zinc-800/20 opacity-70 cursor-not-allowed">
                                <Mail className="text-zinc-500" size={20} />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    disabled={true}
                                    className="bg-transparent w-full outline-none text-zinc-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Date of Birth</label>
                                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-zinc-900 border-zinc-600 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20' : 'bg-zinc-800/50 border-zinc-700'}`}>
                                    <Calendar className="text-zinc-500" size={20} />
                                    <input
                                        type="date"
                                        value={profileData.dob}
                                        onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                        disabled={!isEditing}
                                        className="bg-transparent w-full outline-none text-zinc-200 placeholder-zinc-600 disabled:cursor-not-allowed [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Gender</label>
                                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-zinc-900 border-zinc-600 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20' : 'bg-zinc-800/50 border-zinc-700'}`}>
                                    <Hash className="text-zinc-500" size={20} />
                                    <select
                                        value={profileData.gender}
                                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                        disabled={!isEditing}
                                        className="bg-transparent w-full outline-none text-zinc-200 disabled:cursor-not-allowed appearance-none"
                                    >
                                        <option value="Not Specified" className="bg-zinc-800">Not Specified</option>
                                        <option value="Male" className="bg-zinc-800">Male</option>
                                        <option value="Female" className="bg-zinc-800">Female</option>
                                        <option value="Other" className="bg-zinc-800">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-700">
                        <button
                            onClick={handleLogout}
                            className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-rose-500/20 hover:border-rose-500/30"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
