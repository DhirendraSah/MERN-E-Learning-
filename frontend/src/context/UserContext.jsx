import { createContext, useContext,  useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";





const UserContext = createContext()


export const UserContextProvider = ({children}) => {
  const [user, setUser] = useState([])
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setloading] = useState(true);

   async function loginUser (email, password, navigate) {
    setBtnLoading(true);
    try{
       const {data} = await axios.post(`${server}/api/user/login`,{email,password})

       toaster.success(data.message);
       localStorage.setItem("token", data.token);
       setUser(data.user);
       setIsAuth(true);
       setBtnLoading(false);
       navigate("/");
    }catch (error){
       setBtnLoading(false);
        setIsAuth(false);
       toaster.error(error.response.data.message);
    }
   } 

  async function fetchUser(){
    try{
      const {data} = await axios.get(`${server}/api/user/me`, {
        headers: localStorage.getItem("token"),
      });
      setIsAuth(true);
      setUser(data.user);
      setloading(false);
    }catch (error){
      console.log(error);
      setloading(false);
    }
   
  }
   useEffect(()=>{
    fetchUser();
  },[]);
    return(
         <UserContext.Provider value={{ user, setUser, setIsAuth, isAuth, loginUser, btnLoading, loading}}>
        {children}
        <Toaster/>
        </UserContext.Provider>
  );      
};

export const UserData = () => useContext(UserContext);