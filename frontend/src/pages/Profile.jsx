import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return <div className="p-10 text-center">Please log in to view profile.</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded shadow-sm border">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-semibold">{user.email}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Role</label>
                    <p className="text-lg font-semibold capitalize bg-gray-100 inline-block px-2 py-1 rounded">{user.role}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
