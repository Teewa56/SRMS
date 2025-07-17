import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { editAdmin, getAllAdmins } from "../../api/adminApi";
import Toast from '../../components/Toast';
import handleApiError from '../../apiErrorHandler';
import Loading from '../../components/Loaidng';
import { Edit } from "lucide-react";

export default function EditAdmin() {
    const [searchParams] = useSearchParams();
    const adminId = searchParams.get('adminId');
    const [adminInfo, setAdminInfo] = useState({
        workEmail: '',
        fullName: '',
        phone: '',
        adminId: '',
        profilePic: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getAdminProfile() {
            setLoading(true);
            try {
                const res = await getAllAdmins();
                const admin = res.data.find(admin => admin._id === adminId);
                if (admin) {
                    setAdminInfo(admin);
                    setImagePreview(admin.profilePic || '');
                }
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
        getAdminProfile();
    }, [adminId]);

    function updateAdminInfo(field, value) {
        setAdminInfo(prev => ({
            ...prev, 
            [field]: value
        }));
    }

    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", 'pymeet');
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: data
        });
        const result = await res.json();
        return result.secure_url;
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let profilePicUrl = adminInfo.profilePic;
            if (imageFile) {
                profilePicUrl = await uploadToCloudinary(imageFile);
            }
            const payload = { 
                ...adminInfo, 
                profilePic: profilePicUrl 
            };
            await editAdmin(payload, adminId);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col max-w-md mx-auto p-4">
            {error && <Toast text={error} color={'red'} />}
            {loading && <Loading />}
            <div className="flex items-center justify-start gap-4">
                <img 
                    src="/images/back-button.svg" 
                    className="md:hidden w-6 h-6 cursor-pointer" 
                    onClick={() => navigate(-1)} 
                    alt="Back"
                />
                <h3 className="text-xl font-bold">Edit Admin</h3>
            </div>
            
            <div className="mt-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            className="bg-gray-200 p-2 rounded-xl"
                            placeholder="Enter full name"
                            value={adminInfo.fullName}
                            onChange={(e) => updateAdminInfo('fullName', e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="workEmail">Work Email</label>
                        <input
                            type="email"
                            id="workEmail"
                            className="bg-gray-200 p-2 rounded-xl"
                            placeholder="Enter work email"
                            value={adminInfo.workEmail}
                            onChange={(e) => updateAdminInfo('workEmail', e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            className="bg-gray-200 p-2 rounded-xl"
                            placeholder="Enter phone number"
                            value={adminInfo.phone}
                            onChange={(e) => updateAdminInfo('phone', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 relative w-fit">
                        {imagePreview &&
                        <label htmlFor="profilePic"
                            className="absolute -bottom-1 -right-4 text-white rounded-full bg-green-300 p-3">
                            <Edit size={20} />
                        </label>}
                        {imagePreview && (
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-25 h-25 object-cover rounded-full mb-2" 
                            />
                        )}
                        <input
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition mt-4"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}