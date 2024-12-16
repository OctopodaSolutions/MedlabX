import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const ErrorMessage=(msg)=>{
  return (      
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    );
}


export const SuccessMessage=(msg)=>{
  return (      
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    );
}

