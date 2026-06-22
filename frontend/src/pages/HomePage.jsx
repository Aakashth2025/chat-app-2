import { useAuthStore } from "../store/useAuthStore.js";

const HomePage = () =>{
    const {authUser} = useAuthStore();
    return <div>HomePage</div>
}

export default HomePage;