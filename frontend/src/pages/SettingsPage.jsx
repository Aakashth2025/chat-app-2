import { useAuthStore } from "../store/useAuthStore.js";

const SettingsPage = () =>{
    const {authUser} = useAuthStore();
    return <div>SettingsPage</div>
}

export default SettingsPage; 