import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const ThemeContext = createContext();



export function ThemeProvider({ children }) {


  const [dark, setDark] = useState(() => {

    return localStorage.getItem("theme") === "dark";

  });




  useEffect(() => {


    const html =
      document.documentElement;



    if (dark) {

      html.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );


    } else {


      html.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );


    }


  }, [dark]);





  const toggleTheme = () => {

    setDark(prev => !prev);

  };




  return (

    <ThemeContext.Provider

      value={{
        dark,
        toggleTheme
      }}

    >

      {children}

    </ThemeContext.Provider>

  );

}





export function useTheme(){

  return useContext(ThemeContext);

}